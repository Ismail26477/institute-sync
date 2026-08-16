import { supabase } from "@/integrations/supabase/client";

export const BOOK_CATEGORIES = [
  "Nursing",
  "Basic Sciences",
  "Pharmacology",
  "Physiotherapy",
  "General Reference",
];

export const BUCKET = "library-books";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  edition: string | null;
  category: string;
  language: string | null;
  publication_year: number | null;
  description: string | null;
  cover_image_url: string | null;
  total_copies: number;
  available_copies: number;
  issued_copies: number;
  damaged_copies: number;
  lost_copies: number;
  location: string;
  shelf_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookIssue {
  id: string;
  book_id: string;
  student_id: string;
  issued_by_name: string;
  issue_date: string;
  due_date: string;
  returned_date: string | null;
  return_condition: string | null;
  status: string;
  notes: string | null;
  books?: Pick<Book, "id" | "title" | "author" | "isbn" | "cover_image_url" | "location"> | null;
  students?: { id: string; student_id: string; name: string; course: string; institute: string; batch: string } | null;
}

export const todayISO = () => new Date().toISOString().split("T")[0];

export const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const daysBetween = (from: string, to: string) =>
  Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000);

export const isOverdue = (issue: BookIssue) =>
  !issue.returned_date && issue.due_date < todayISO();

export const bookStatus = (b: Book) => {
  if (b.available_copies <= 0) return "Out of Stock";
  if (b.available_copies < b.total_copies) return "Partially Available";
  return "Available";
};

/** Creates short-lived signed URLs for private cover images, keyed by storage path. */
export async function signCovers(paths: (string | null | undefined)[]) {
  const unique = Array.from(new Set(paths.filter((p): p is string => !!p)));
  if (unique.length === 0) return {} as Record<string, string>;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, 3600);
  const map: Record<string, string> = {};
  (data ?? []).forEach((entry) => {
    if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
  });
  return map;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG or WEBP images are allowed";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be smaller than 5MB";
  return null;
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected image"));
    reader.readAsDataURL(file);
  });
}

export async function uploadCover(file: File, folder: "covers" | "scans" = "covers") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return path;
}

export async function logAudit(action: string, recordType: string, recordId: string | null, details: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("library_audit_log").insert({
    user_id: data.user.id,
    user_name: data.user.email ?? "",
    action,
    record_type: recordType,
    record_id: recordId,
    details,
  });
}

export function toCsv(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
