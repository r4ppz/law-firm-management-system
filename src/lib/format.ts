export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "Unknown";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const factor = 1024;
  let unitIndex = 0;
  let size = bytes;

  while (size >= factor && unitIndex < units.length - 1) {
    size /= factor;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatFileType(fileType: string): string {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || type.includes("doc")) return "DOCX";
  if (type.includes("excel") || type.includes("xls")) return "XLSX";
  if (
    type.includes("image") ||
    type.includes("png") ||
    type.includes("jpg") ||
    type.includes("jpeg") ||
    type.includes("gif")
  )
    return "IMG";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return "ZIP";
  if (type.includes("text") || type.includes("csv")) return "TXT";

  return type.split("/").pop()?.toUpperCase() ?? type;
}
