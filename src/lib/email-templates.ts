/**
 * Plain-HTML email template functions for notification types.
 *
 * Each template accepts a {@link TemplateContext} and returns a full HTML
 * document wrapped in the shared {@link emailLayout}. Avoids React rendering
 * on the server (Turbopack blocks `react-dom/server`).
 */

interface TemplateContext {
  /** Display name of the recipient. */
  toName: string;
  /** Display name of the user who triggered the notification. */
  actorName: string;
  /** Notification title (used as fallback heading). */
  title: string;
  /** Notification body text. */
  message: string;
  /** Optional link to the relevant entity detail page. */
  actionUrl?: string;
}

/**
 * Wraps body content in the firm's branded email layout.
 *
 * @param title - The page-level heading shown inside the email body.
 * @param body - Inner HTML content.
 * @returns A complete HTML document string.
 */
function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff">
<div style="padding:24px 32px;background-color:#1a3a5c">
<h1 style="color:#ffffff;font-size:20px;margin:0">Anino Law &amp; Real Estate Firm</h1>
</div>
<div style="padding:32px">
<h2 style="color:#1a3a5c;font-size:18px;margin:0 0 16px">${title}</h2>
${body}
</div>
<div style="padding:16px 32px;background-color:#f4f4f4;color:#666666;font-size:12px;text-align:center">
<p style="margin:0">This is an automated notification from Anino Law &amp; Real Estate Firm. Please do not reply directly to this email.</p>
</div>
</div>
</body>
</html>`;
}

/**
 * Renders a call-to-action button linking to a resource.
 *
 * @param url - The target URL.
 * @param label - Button label text.
 * @returns An HTML table string styled as a button.
 */
function button(url: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="background-color:#1a3a5c;border-radius:4px"><a href="${url}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:14px">${label}</a></td></tr></table>`;
}

/**
 * Email template for when a consultation is created.
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function consultationCreatedTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">${ctx.actorName} has scheduled a new consultation.</p>
<p style="color:#555555;line-height:1.6;margin:0 0 12px;font-style:italic">&ldquo;${ctx.message}&rdquo;</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Consultation") : ""}`.trim();

  return emailLayout("New Consultation Scheduled", body);
}

/**
 * Email template for when a consultation is updated.
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function consultationUpdatedTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">A consultation has been updated.</p>
<p style="color:#555555;line-height:1.6;margin:0 0 12px">${ctx.message}</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Consultation") : ""}`.trim();

  return emailLayout("Consultation Updated", body);
}

/**
 * Email template for milestone notifications (created, due-soon, completed).
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function milestoneTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">${ctx.message}</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Case") : ""}`.trim();

  return emailLayout(ctx.title, body);
}

/**
 * Email template for when a task is assigned to a user.
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function taskAssignedTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">${ctx.actorName} has assigned you a task: <strong>${ctx.title}</strong>.</p>
<p style="color:#555555;line-height:1.6;margin:0 0 12px">${ctx.message}</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Task") : ""}`.trim();

  return emailLayout("Task Assigned", body);
}

/**
 * Email template for when a task's status or details are updated.
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function taskUpdatedTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">A task has been updated: <strong>${ctx.title}</strong>.</p>
<p style="color:#555555;line-height:1.6;margin:0 0 12px">${ctx.message}</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Task") : ""}`.trim();

  return emailLayout("Task Updated", body);
}

/**
 * Email template for when a new case is created.
 *
 * @param ctx - Template context.
 * @returns A complete HTML email string.
 */
export function caseAssignedTemplate(ctx: TemplateContext): string {
  const body = `
<p style="color:#333333;line-height:1.6;margin:0 0 12px">Hi ${ctx.toName},</p>
<p style="color:#333333;line-height:1.6;margin:0 0 12px">${ctx.actorName} created a new case: <strong>${ctx.title}</strong>.</p>
<p style="color:#555555;line-height:1.6;margin:0 0 12px">${ctx.message}</p>
${ctx.actionUrl ? button(ctx.actionUrl, "View Case") : ""}`.trim();

  return emailLayout("New Case Created", body);
}
