import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const download = request.nextUrl.searchParams.get("download") === "1";
  const res = await apiFetch(`/api/payments/${messageId}/pdf${download ? "?download=1" : ""}`);

  if (!res.ok) {
    const body = await res.text();
    return new NextResponse(body, { status: res.status });
  }

  const headers = new Headers({ "content-type": "application/pdf" });
  const contentDisposition = res.headers.get("content-disposition");
  if (contentDisposition) headers.set("content-disposition", contentDisposition);

  return new NextResponse(res.body, { status: res.status, headers });
}
