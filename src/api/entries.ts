import type { DiaryEntry, EntryRequest } from "../types/entry";
import { request, resolveUrl } from "./client";

const jsonHeaders = { "Content-Type": "application/json" };

function withFullPhotoUrl(entry: DiaryEntry): DiaryEntry {
  return entry.photoUrl
    ? { ...entry, photoUrl: resolveUrl(entry.photoUrl) }
    : entry;
}

export async function getEntries() {
  const entries = await request<DiaryEntry[]>("/api/entries");
  return entries.map(withFullPhotoUrl);
}

export async function createEntry(entry: EntryRequest) {
  const created = await request<DiaryEntry>("/api/entries", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
  return withFullPhotoUrl(created);
}

export async function updateEntry(id: number, entry: EntryRequest) {
  const updated = await request<DiaryEntry>(`/api/entries/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
  return withFullPhotoUrl(updated);
}

export async function uploadPhoto(id: number, photo: File) {
  const body = new FormData();
  body.append("photo", photo);

  const updated = await request<DiaryEntry>(`/api/entries/${id}/photo`, {
    method: "POST",
    body,
  });
  return withFullPhotoUrl(updated);
}
