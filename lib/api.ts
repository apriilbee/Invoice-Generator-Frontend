import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/constants";

export const API_URL = process.env.API_URL ?? "http://localhost:5001";
export { TOKEN_COOKIE };

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export type Payment = {
  message_id: string;
  sender_name: string;
  amount: string;
  currency: string;
  payment_date: string;
  month_label: string;
};
