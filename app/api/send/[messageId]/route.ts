import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const res = await apiFetch(`/api/payments/${messageId}/send`, { method: "POST" });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
