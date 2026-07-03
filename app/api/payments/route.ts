import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request: NextRequest) {
  const qs = request.nextUrl.searchParams.toString();
  const res = await apiFetch(`/api/payments${qs ? `?${qs}` : ""}`);
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
