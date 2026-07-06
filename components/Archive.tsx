"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentActions from "./PaymentActions";
import type { Payment } from "@/lib/api";

export default function Archive() {
  const router = useRouter();
  const [items, setItems] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/payments?page=${page}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setItems(data.items ?? []);
        setTotalPages(data.total_pages ?? 1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <div className="older">
      <div className="older__header">
        <span className="older__label">Archive</span>
        <span className="older__rule" aria-hidden="true"></span>
      </div>

      <ul className="older__list">
        {items.map((item) => (
          <li key={item.message_id} className="older__item" onClick={() => setSelected(item)}>
            <span className="older__month">{item.month_label}</span>
            <span className="older__peek">
              {item.currency} {item.amount}
            </span>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 ? (
            <button className="pagination__link" onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
          ) : (
            <span className="pagination__link pagination__link--disabled">← Prev</span>
          )}
          <span className="pagination__status">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <button className="pagination__link" onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          ) : (
            <span className="pagination__link pagination__link--disabled">Next →</span>
          )}
        </div>
      )}

      {selected && (
        <div
          className="modal-backdrop is-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <button className="modal__close" onClick={() => setSelected(null)} aria-label="Close">
              ✕
            </button>
            <div className="modal__label" id="modal-label">
              {selected.month_label}
            </div>
            <div className="modal__amount">
              <span className="modal__currency">{selected.currency}</span>
              <span className="modal__value">{selected.amount}</span>
            </div>
            <div className="modal__meta">
              <div className="modal__row">
                <span className="modal__key">From</span>
                <span className="modal__val">{selected.sender_name}</span>
              </div>
              <div className="modal__row">
                <span className="modal__key">Paid</span>
                <span className="modal__val">{selected.payment_date}</span>
              </div>
            </div>
            <div className="modal__actions">
              <PaymentActions key={selected.message_id} messageId={selected.message_id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
