import type { DiaryEntry, EntryRequest } from "../types/entry";
import { request } from "./client";

const jsonHeaders = { "Content-Type": "application/json" };

export function getEntries() {
  return request<DiaryEntry[]>("/api/entries");
}

export function createEntry(entry: EntryRequest) {
  return request<DiaryEntry>("/api/entries", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
}

export function updateEntry(id: number, entry: EntryRequest) {
  return request<DiaryEntry>(`/api/entries/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
}

export function uploadPhoto(id: number, photo: File) {
  const body = new FormData();
  body.append("photo", photo);

  return request<DiaryEntry>(`/api/entries/${id}/photo`, {
    method: "POST",
    body,
  });
}
