import { getUserNameById, getUsersByIds } from "@/features/users/queries";
import { NotificationType } from "@/generated/prisma/browser";
import { sendEmail } from "@/lib/email";
import {
  caseAssignedTemplate,
  consultationCreatedTemplate,
  consultationUpdatedTemplate,
  milestoneTemplate,
  taskAssignedTemplate,
  taskUpdatedTemplate,
} from "@/lib/email-templates";

import { createNotifications } from "./mutations";
import type { NotificationDispatchPayload } from "./schemas";

function pickTemplate(type: NotificationType) {
  switch (type) {
    case NotificationType.ConsultationCreated:
    case NotificationType.ConsultationReminder:
      return consultationCreatedTemplate;
    case NotificationType.ConsultationUpdated:
      return consultationUpdatedTemplate;
    case NotificationType.MilestoneDueSoon:
    case NotificationType.MilestoneCompleted:
    case NotificationType.MilestoneOverdue:
      return milestoneTemplate;
    case NotificationType.TaskAssigned:
      return taskAssignedTemplate;
    case NotificationType.TaskStatusChanged:
      return taskUpdatedTemplate;
    case NotificationType.CaseAssigned:
      return caseAssignedTemplate;
    default:
      return null;
  }
}

export async function dispatchNotifications(
  payload: NotificationDispatchPayload,
  actorUserId: string,
) {
  const result = await createNotifications(payload);

  const actorName = (await getUserNameById(actorUserId)) ?? "System";

  const recipients = await getUsersByIds(payload.userIds);

  const template = pickTemplate(payload.type);

  if (template) {
    for (const user of recipients) {
      try {
        if (!user.email) continue;

        const html = template({
          toName: user.name ?? user.email,
          actorName,
          title: payload.title,
          message: payload.message,
          actionUrl: payload.actionUrl,
        });

        await sendEmail({ to: user.email, subject: payload.title, html });
      } catch (err) {
        console.error(`Failed to send email notification to user ${user.id}:`, err);
      }
    }
  }

  return result;
}
