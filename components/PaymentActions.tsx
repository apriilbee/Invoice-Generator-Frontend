"use client";

import { useState } from "react";

export default function PaymentActions({ messageId }: { messageId: string }) {
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

  function handleDownloadClick() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 4000);
  }

  const sendDisabled = sending || sent;
  const sendLabel = sending ? "Sending…" : sent ? "Sent ✓" : "Send Invoice";

  return (
    <>
      <div className="card__actions">
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
        <a
          className="btn btn--primary"
          href={`/api/pdf/${messageId}?download=1`}
          download
          onClick={handleDownloadClick}
          style={downloading ? { pointerEvents: "none" } : undefined}
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
        </a>
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
