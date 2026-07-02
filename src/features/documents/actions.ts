"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { deleteFile, generateKey, getPresignedDownloadUrl, getPresignedUploadUrl } from "@/lib/s3";

import { createDocument, deleteDocument as deleteDocumentRecord } from "./mutations";
import {
  getDocumentById,
  getDocumentsPaginated,
  type DocumentPageQuery,
  type DocumentRow,
} from "./queries";

interface DocumentUploadPayload {
  file_name: string;
  file_type: string;
  case_id?: string | null;
  consultation_id?: string | null;
}

interface DocumentConfirmPayload {
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  case_id?: string | null;
  consultation_id?: string | null;
}

export async function getDocumentsPaginatedAction(
  params: DocumentPageQuery,
): Promise<{ rows: DocumentRow[]; nextCursor: string | null }> {
  return getDocumentsPaginated(params);
}

export async function getDocumentUploadUrlAction(
  payload: DocumentUploadPayload,
): Promise<{ key: string; uploadUrl: string }> {
  const { file_name, file_type, case_id, consultation_id } = payload;

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parentType = case_id ? "cases" : "consultations";
  const parentId = case_id ?? consultation_id!;
  const key = generateKey(parentType, parentId, file_name);
  const uploadUrl = await getPresignedUploadUrl(key, file_type);

  return { key, uploadUrl };
}

export async function confirmDocumentUploadAction(
  payload: DocumentConfirmPayload,
): Promise<{ id: string }> {
  const { file_name, file_type, file_size, file_path, case_id, consultation_id } = payload;

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await createDocument({
    file_name,
    file_path,
    file_type,
    file_size,
    case_id,
    consultation_id,
    uploaded_by_user_id: session.user.id,
  });

  revalidatePath(case_id ? `/case/${case_id}` : `/consultation/${consultation_id}`);

  return { id: doc.id };
}

export async function getDocumentDownloadUrlAction(
  documentId: string,
): Promise<{ url: string; file_name: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await getDocumentById(documentId);
  if (!doc) throw new Error("Document not found");

  const url = await getPresignedDownloadUrl(doc.file_path);

  return { url, file_name: doc.file_name };
}

export async function deleteDocumentAction(documentId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await getDocumentById(documentId);
  if (!doc) throw new Error("Document not found");

  await deleteFile(doc.file_path);
  await deleteDocumentRecord(documentId);

  const path = doc.case_id
    ? `/case/${doc.case_id}`
    : doc.consultation_id
      ? `/consultation/${doc.consultation_id}`
      : "/case";

  revalidatePath(path);
}
