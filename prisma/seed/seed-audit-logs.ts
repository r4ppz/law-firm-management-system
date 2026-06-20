import { prisma } from "@/lib/prisma";

interface AuditData {
  actorEmail: string;
  action: string;
  entityType: string;
  details: string;
  daysAgo: number;
}

const auditLogs: AuditData[] = [
  {
    actorEmail: "dev@aninolaw.com",
    action: "SEED",
    entityType: "System",
    details: "Database seeded with initial data",
    daysAgo: 60,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "CREATE",
    entityType: "User",
    details: "Created user account for Catherine Diaz (BranchManager)",
    daysAgo: 55,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "CREATE",
    entityType: "User",
    details: "Created user account for Robert Santos (BranchManager)",
    daysAgo: 55,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "CREATE",
    entityType: "User",
    details: "Created user account for Atty. Miguel Cruz (Lawyer)",
    daysAgo: 50,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "CREATE",
    entityType: "User",
    details: "Created user account for Atty. Sofia Villanueva (Lawyer)",
    daysAgo: 50,
  },
  {
    actorEmail: "james.reyes@aninolaw.com",
    action: "CREATE",
    entityType: "User",
    details: "Created user accounts for paralegals and process servers",
    daysAgo: 45,
  },
  {
    actorEmail: "david.tan@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Juan Dela Cruz — Property acquisition",
    daysAgo: 30,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Maria Gonzales — Legal separation",
    daysAgo: 25,
  },
  {
    actorEmail: "miguel.cruz@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Carlos Reyes — Breach of contract",
    daysAgo: 20,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Fatima Alcantara — Annulment",
    daysAgo: 18,
  },
  {
    actorEmail: "david.tan@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Miguel Navarro — Real estate JV",
    daysAgo: 60,
  },
  {
    actorEmail: "robert.santos@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Gregorio Santiago — Zoning variance",
    daysAgo: 15,
  },
  {
    actorEmail: "jessica.lim@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Antonio Lopez — Boundary dispute",
    daysAgo: -3,
  },
  {
    actorEmail: "kevin.garcia@aninolaw.com",
    action: "CREATE",
    entityType: "Consultation",
    details: "Created consultation for Patricia Luna — Medical malpractice",
    daysAgo: -2,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Dela Cruz Property Title Transfer",
    daysAgo: 28,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Gonzales Legal Separation",
    daysAgo: 23,
  },
  {
    actorEmail: "miguel.cruz@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Reyes vs. San Miguel Logistics",
    daysAgo: 18,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Alcantara Annulment Proceedings",
    daysAgo: 16,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Navarro Estate Development Joint Venture",
    daysAgo: 55,
  },
  {
    actorEmail: "robert.santos@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Santiago Zoning Compliance Appeal",
    daysAgo: 13,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Lopez Property Boundary Litigation",
    daysAgo: 7,
  },
  {
    actorEmail: "angela.mercado@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Villanueva Corporation Registration",
    daysAgo: 50,
  },
  {
    actorEmail: "ricardo.guevarra@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Fernandez Criminal Defense — Estafa Case",
    daysAgo: 12,
  },
  {
    actorEmail: "miguel.cruz@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Castillo Illegal Dismissal Complaint",
    daysAgo: 9,
  },
  {
    actorEmail: "gina.reyes@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Hernandez Property Tax Protest",
    daysAgo: 6,
  },
  {
    actorEmail: "angela.mercado@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Ramirez Corp — Series A Funding",
    daysAgo: 4,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Rodriguez Estate Settlement",
    daysAgo: 5,
  },
  {
    actorEmail: "marco.lopez@aninolaw.com",
    action: "CREATE",
    entityType: "Case",
    details: "Case opened: Santos Foreclosure Defense",
    daysAgo: 6,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "CREATE",
    entityType: "Task",
    details: "Task created: Verify Property Title with Registry of Deeds",
    daysAgo: 25,
  },
  {
    actorEmail: "david.tan@aninolaw.com",
    action: "CREATE",
    entityType: "Task",
    details: "Task created: Draft Deed of Absolute Sale",
    daysAgo: 20,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "UPDATE",
    entityType: "Task",
    details: "Task submitted for review: Coordinate Tax Payment with BIR",
    daysAgo: 2,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Task",
    details: "Task created: Draft Petition for Legal Separation",
    daysAgo: 20,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "UPDATE",
    entityType: "Task",
    details: "Task submitted for review: Gather Evidence of Psychological Incapacity",
    daysAgo: 3,
  },
  {
    actorEmail: "miguel.cruz@aninolaw.com",
    action: "CREATE",
    entityType: "Task",
    details: "Task created: File Complaint with Regional Trial Court",
    daysAgo: 15,
  },
  {
    actorEmail: "marco.lopez@aninolaw.com",
    action: "CREATE",
    entityType: "Task",
    details: "Task created: Conduct Site Inspection and Survey",
    daysAgo: 6,
  },
  {
    actorEmail: "marco.lopez@aninolaw.com",
    action: "UPDATE",
    entityType: "Task",
    details: "Task submitted: File Motion to Suspend Foreclosure Sale",
    daysAgo: 1,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "CREATE",
    entityType: "Payment",
    details: "Payment recorded: Retainer fee for Dela Cruz case — PHP 50,000",
    daysAgo: 28,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "CREATE",
    entityType: "Payment",
    details: "Payment recorded: Consultation fee from Roberto Hernandez — PHP 1,500",
    daysAgo: 14,
  },
  {
    actorEmail: "james.reyes@aninolaw.com",
    action: "CREATE",
    entityType: "Payment",
    details: "Payment recorded: Consultation fee from Carlos Reyes — PHP 2,000",
    daysAgo: 20,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "UPDATE",
    entityType: "Payment",
    details: "Payment status updated to Refunded: Castillo case milestone payment",
    daysAgo: 3,
  },
  {
    actorEmail: "david.tan@aninolaw.com",
    action: "CREATE",
    entityType: "Milestone",
    details: "Milestone created: Title Verification Complete for Dela Cruz case",
    daysAgo: 25,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Milestone",
    details: "Milestone created: Petition Filed with RTC for Gonzales case",
    daysAgo: 20,
  },
  {
    actorEmail: "miguel.cruz@aninolaw.com",
    action: "UPDATE",
    entityType: "Milestone",
    details: "Milestone completed: Complaint Filed with RTC for Reyes case",
    daysAgo: 2,
  },
  {
    actorEmail: "angela.mercado@aninolaw.com",
    action: "UPDATE",
    entityType: "Case",
    details: "Case closed: Villanueva Corporation Registration — all permits secured",
    daysAgo: 30,
  },
  {
    actorEmail: "catherine.diaz@aninolaw.com",
    action: "UPDATE",
    entityType: "Case",
    details: "Case closed: Navarro Estate Development Joint Venture — JVA executed",
    daysAgo: 20,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "UPDATE",
    entityType: "User",
    details: "Deactivated user: Paolo Santos — resigned effective immediately",
    daysAgo: 15,
  },
  {
    actorEmail: "maria.anino@aninolaw.com",
    action: "UPDATE",
    entityType: "User",
    details: "Deactivated user: Rodel Francisco — terminated for cause",
    daysAgo: 10,
  },
  {
    actorEmail: "sofia.villanueva@aninolaw.com",
    action: "CREATE",
    entityType: "Note",
    details: "Case note added: Client emotional during meeting. Need to expedite filing.",
    daysAgo: 5,
  },
  {
    actorEmail: "ricardo.guevarra@aninolaw.com",
    action: "CREATE",
    entityType: "Document",
    details: "Uploaded: Motion-to-Dismiss-Estafa.pdf",
    daysAgo: 8,
  },
  {
    actorEmail: "angela.mercado@aninolaw.com",
    action: "CREATE",
    entityType: "Document",
    details: "Uploaded: Kairus-Capital-Term-Sheet.pdf",
    daysAgo: 5,
  },
];

export async function seedAuditLogs(userByEmail: Record<string, string>): Promise<void> {
  let count = 0;
  for (const a of auditLogs) {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - a.daysAgo);

    await prisma.auditLog.create({
      data: {
        actor_user_id: userByEmail[a.actorEmail],
        action: a.action,
        entity_type: a.entityType,
        entity_id: "00000000-0000-0000-0000-000000000000",
        details: a.details,
        created_at: logDate,
      },
    });
    count++;
  }

  console.log(`Seeded ${count} audit logs.`);
}
