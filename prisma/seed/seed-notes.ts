import { prisma } from "@/lib/prisma";

interface NoteData {
  content: string;
  caseTitle?: string;
  consultationClientEmail?: string;
  taskTitle?: string;
  createdByEmail: string;
  daysAgo: number;
}

const notes: NoteData[] = [
  {
    content:
      "Client called to confirm property title verification is in progress. Seller's representative requested an update on timeline.",
    caseTitle: "Dela Cruz Property Title Transfer",
    createdByEmail: "jessica.lim@aninolaw.com",
    daysAgo: 3,
  },
  {
    content:
      "Spoke with BIR office regarding capital gains tax computation. They require the latest tax declaration which we need to request from the client.",
    caseTitle: "Dela Cruz Property Title Transfer",
    createdByEmail: "jessica.lim@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Client emotional during meeting. Husband has not provided financial support for 8 months. Need to prioritize filing of petition.",
    caseTitle: "Gonzales Legal Separation",
    createdByEmail: "sofia.villanueva@aninolaw.com",
    daysAgo: 5,
  },
  {
    content:
      "Drafting petition — need to review previous psychological evaluation reports submitted during marriage counseling.",
    caseTitle: "Gonzales Legal Separation",
    createdByEmail: "kevin.garcia@aninolaw.com",
    daysAgo: 2,
  },
  {
    content:
      "Initial consultation went well. Strong case for breach of contract. San Miguel Logistics clearly failed to meet delivery obligations. Will proceed with filing.",
    caseTitle: "Reyes vs. San Miguel Logistics",
    createdByEmail: "miguel.cruz@aninolaw.com",
    daysAgo: 10,
  },
  {
    content:
      "Received defendants' answer via counsel Atty. Villanueva of Villanueva Law. They raised prescription as affirmative defense. Need to prepare response.",
    caseTitle: "Reyes vs. San Miguel Logistics",
    createdByEmail: "miguel.cruz@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Client provided wedding certificate and photos from marriage. Husband exhibited controlling behavior and verbal abuse throughout marriage.",
    caseTitle: "Alcantara Annulment Proceedings",
    createdByEmail: "maya.fernandez@aninolaw.com",
    daysAgo: 4,
  },
  {
    content:
      "Psychologist Dr. Reyes confirmed availability for evaluation. Scheduled client appointment for next week Friday.",
    caseTitle: "Alcantara Annulment Proceedings",
    createdByEmail: "sofia.villanueva@aninolaw.com",
    daysAgo: 2,
  },
  {
    content:
      "JVA final version sent to Kingsbridge Capital for review. Client approved all terms including profit-sharing ratio of 60-40.",
    caseTitle: "Navarro Estate Development Joint Venture",
    createdByEmail: "angela.mercado@aninolaw.com",
    daysAgo: 35,
  },
  {
    content: "All permits secured. Closing file for this matter. Summary report sent to client.",
    caseTitle: "Navarro Estate Development Joint Venture",
    createdByEmail: "david.tan@aninolaw.com",
    daysAgo: 20,
  },
  {
    content:
      "Filed zoning variance application with Calamba City. Receipt number 2024-8912. Waiting for hearing schedule.",
    caseTitle: "Santiago Zoning Compliance Appeal",
    createdByEmail: "nina.salvador@aninolaw.com",
    daysAgo: 3,
  },
  {
    content:
      "City planning office requested additional documents — environmental impact assessment and traffic study. Need to coordinate with client.",
    caseTitle: "Santiago Zoning Compliance Appeal",
    createdByEmail: "gina.reyes@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Site inspection confirmed encroachment. Defendant's fence extends 2.5 meters into client's property. Surveyor's report attached.",
    caseTitle: "Lopez Property Boundary Litigation",
    createdByEmail: "marco.lopez@aninolaw.com",
    daysAgo: 5,
  },
  {
    content:
      "Witness interview completed. Neighbor Mrs. Cruz confirmed the original boundary markers were placed in 1995.",
    caseTitle: "Lopez Property Boundary Litigation",
    createdByEmail: "paolo.guerrero@aninolaw.com",
    daysAgo: 2,
  },
  {
    content:
      "SEC approved name reservation: VILLANUEVA ENTERPRISES INC. Proceeding with AOI filing.",
    caseTitle: "Villanueva Corporation Registration",
    createdByEmail: "maya.fernandez@aninolaw.com",
    daysAgo: 48,
  },
  {
    content:
      "Police blotter report and medical certificate from the alleged victim appear inconsistent with estafa elements. Strong motion to dismiss basis.",
    caseTitle: "Fernandez Criminal Defense — Estafa Case",
    createdByEmail: "ricardo.guevarra@aninolaw.com",
    daysAgo: 8,
  },
  {
    content:
      "Prosecution evidence shows complainant issued multiple demand letters but gave additional time to pay. Weakens their claim of deceit.",
    caseTitle: "Fernandez Criminal Defense — Estafa Case",
    createdByEmail: "nina.salvador@aninolaw.com",
    daysAgo: 3,
  },
  {
    content:
      "Client sent screenshots of GCash payment proofs showing partial payments to complainant. This undermines the estafa claim.",
    caseTitle: "Fernandez Criminal Defense — Estafa Case",
    createdByEmail: "ricardo.guevarra@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Employment contract clearly shows regular employment status. JFC's claim of independent contractor status is baseless.",
    caseTitle: "Castillo Illegal Dismissal Complaint",
    createdByEmail: "miguel.cruz@aninolaw.com",
    daysAgo: 6,
  },
  {
    content:
      "Computed back wages amount to approximately PHP 340,000 including 13th month pay for 8 months.",
    caseTitle: "Castillo Illegal Dismissal Complaint",
    createdByEmail: "jessica.lim@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Filed appeal with LBAA. Assessor's office doubled the value from PHP 2.5M to PHP 5.0M without any improvements on the property.",
    caseTitle: "Hernandez Property Tax Protest",
    createdByEmail: "paolo.guerrero@aninolaw.com",
    daysAgo: 4,
  },
  {
    content:
      "Found three comparable properties within the same barangay with significantly lower assessments. Strong evidence for appeal.",
    caseTitle: "Hernandez Property Tax Protest",
    createdByEmail: "kevin.garcia@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Term sheet received from Kairus Capital: Pre-money valuation PHP 80M, asking for 20% equity. Need to review liquidation preference clause carefully.",
    caseTitle: "Ramirez Corp — Series A Funding",
    createdByEmail: "angela.mercado@aninolaw.com",
    daysAgo: 5,
  },
  {
    content:
      "Client's cap table shows 3 existing shareholders with standard vesting. Need to ensure Series A terms don't disproportionately dilute founders.",
    caseTitle: "Ramirez Corp — Series A Funding",
    createdByEmail: "maya.fernandez@aninolaw.com",
    daysAgo: 3,
  },
  {
    content:
      "Estate assets identified: 3 residential lots in QC, 2 bank accounts (BPI, BDO), 1 vehicle (Toyota Fortuner 2020), and PHP 500K in stocks.",
    caseTitle: "Rodriguez Estate Settlement",
    createdByEmail: "kevin.garcia@aninolaw.com",
    daysAgo: 2,
  },
  {
    content:
      "Deceased left no will. Intestate succession applies. Heirs are the widow (Elena) and 3 legitimate children. Need to secure waivers of share.",
    caseTitle: "Rodriguez Estate Settlement",
    createdByEmail: "sofia.villanueva@aninolaw.com",
    daysAgo: 1,
  },
  {
    content:
      "Reviewed loan documents — interest rate increased from 8% to 18% without proper disclosure. Potential violation of Truth in Lending Act.",
    caseTitle: "Santos Foreclosure Defense",
    createdByEmail: "nina.salvador@aninolaw.com",
    daysAgo: 3,
  },
  {
    content:
      "Urgent motion filed today. Court set hearing for Monday next week. Preparing supporting affidavit.",
    caseTitle: "Santos Foreclosure Defense",
    createdByEmail: "marco.lopez@aninolaw.com",
    daysAgo: 2,
  },
  {
    content:
      "Bank agreed to tentative restructuring: 12% interest, 5-year term, with 6-month grace period. Client reviewing proposal.",
    caseTitle: "Santos Foreclosure Defense",
    createdByEmail: "marco.lopez@aninolaw.com",
    daysAgo: 0,
  },
  {
    content:
      "Consultation completed. Advised client to file formal appeal with City Assessor's office first before elevating to LBAA.",
    consultationClientEmail: "roberto.hernandez@email.com",
    createdByEmail: "gina.reyes@aninolaw.com",
    daysAgo: 14,
  },
  {
    content:
      "Recommended client explore loan restructuring with bank directly before pursuing litigation. Provided template for restructuring letter.",
    consultationClientEmail: "catherine.santos@email.com",
    createdByEmail: "marco.lopez@aninolaw.com",
    daysAgo: 10,
  },
  {
    content:
      "Prepared notarized last will and testament for client. Includes provisions for special children with trust fund setup.",
    consultationClientEmail: "mercedes.alvarez@email.com",
    createdByEmail: "sofia.villanueva@aninolaw.com",
    daysAgo: 21,
  },
  {
    content:
      "Case has no legal merit. Neighbor's complaint appears to be a simple nuisance suit. Advised client to seek barangay mediation.",
    consultationClientEmail: "victorino.rivera@email.com",
    createdByEmail: "miguel.cruz@aninolaw.com",
    daysAgo: 5,
  },
  {
    content:
      "Outside our practice area — unlawful detainer with novel E-commerce Act issues. Referred to Atty. Dela Cruz of Cruz & Partners.",
    consultationClientEmail: "hernando.cruz@email.com",
    createdByEmail: "marco.lopez@aninolaw.com",
    daysAgo: 3,
  },
];

export async function seedNotes(
  userByEmail: Record<string, string>,
  clients: { id: string; email: string }[],
  cases: { id: string; title: string }[],
): Promise<void> {
  const caseByTitle = Object.fromEntries(cases.map((c) => [c.title, c.id]));

  const allCons = await prisma.consultation.findMany({
    select: { id: true, client_id: true },
  });
  const clientIdToConId = Object.fromEntries(allCons.map((c) => [c.client_id, c.id]));

  const clientByEmail = Object.fromEntries(clients.map((c) => [c.email, c.id]));

  let count = 0;
  for (const n of notes) {
    const noteDate = new Date();
    noteDate.setDate(noteDate.getDate() - n.daysAgo);

    const data: Record<string, unknown> = {
      content: n.content,
      created_by_user_id: userByEmail[n.createdByEmail],
      created_at: noteDate,
    };

    if (n.caseTitle) {
      data.case_id = caseByTitle[n.caseTitle];
    }

    if (n.consultationClientEmail) {
      const clientId = clientByEmail[n.consultationClientEmail];
      data.consultation_id = clientIdToConId[clientId];
    }

    await prisma.note.create({ data: data as Parameters<typeof prisma.note.create>[0]["data"] });
    count++;
  }

  console.log(`Seeded ${count} notes.`);
}
