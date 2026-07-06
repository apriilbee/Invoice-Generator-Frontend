"use client";

import { useState } from "react";

export default function PaymentActions({
  messageId,
  className = "card__actions",
}: {
  messageId: string;
  className?: string;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleSend() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/send/${messageId}`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSent(true);
      } else {
        throw new Error(data.error || data.message || "Unknown error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSending(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/pdf/${messageId}?download=1`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition");
      const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `invoice-${messageId}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  const sendDisabled = sending || sent;
  const sendLabel = sending ? "Sending…" : sent ? "Sent ✓" : "Send Invoice";

  return (
    <>
      <div className={className}>
        <a
          className="btn btn--ghost"
          href={`/api/pdf/${messageId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M1 6.5s2-3.5 5.5-3.5 5.5 3.5 5.5 3.5-2 3.5-5.5 3.5S1 6.5 1 6.5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          View PDF
        </a>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleDownload}
          disabled={downloading}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M6.5 1v7.5M3 6l3.5 3.5L10 6M1 11.5h11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="btn__label">{downloading ? "Generating…" : "Download PDF"}</span>
        </button>
        <button className="btn btn--ghost" disabled={sendDisabled} onClick={handleSend}>
          {!sendDisabled && (
            <svg
              className="btn__icon"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1.5l11 5-11 5V8.5L8.5 6.5 1 4.5V1.5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="btn__label">{sendLabel}</span>
        </button>
      </div>
      <div
        className={`send-status ${sent ? "send-status--ok" : ""} ${error ? "send-status--err" : ""}`}
      >
        {sent && "Invoice delivered."}
        {error && `Failed: ${error}`}
      </div>
    </>
  );
}
