import { redirect } from "next/navigation";
import { apiFetch, type Payment } from "@/lib/api";
import PaymentActions from "@/components/PaymentActions";
import Archive from "@/components/Archive";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const res = await apiFetch("/api/payments?scope=current");
  if (res.status === 401) {
    redirect("/login");
  }

  const data = await res.json();
  const currentMonth: string = data.current_month;
  const items: Payment[] = data.items ?? [];

  return (
    <div className="page">
      <header className="header">
        <div className="header__wordmark">
          <span className="header__title">Invoice Inbox</span>
          <span className="header__tagline">salary ledger</span>
        </div>
        <div className="header__right">
          <span className="header__month">{currentMonth}</span>
          <a href="/logout" className="btn-logout" title="Sign out">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M9.5 10l3-3-3-3M12.5 7H5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </header>

      {items.length > 0 ? (
        <div className="inbox">
          {items.map((item, index) => (
            <div
              className="card"
              key={item.message_id}
              style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}
            >
              <div className="card__rail" aria-hidden="true"></div>
              <div className="card__body">
                <div className="card__meta">
                  <span className="card__sender">{item.sender_name}</span>
                  <span className="card__date">{item.payment_date}</span>
                </div>
                <div className="card__amount">
                  <span className="card__currency">{item.currency}</span>
                  <span className="card__value">{item.amount}</span>
                </div>
                <PaymentActions messageId={item.message_id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty__mark">—</div>
          <div className="empty__title">Nothing this month.</div>
          <div className="empty__sub">Check back after payday.</div>
        </div>
      )}

      <Archive />
    </div>
  );
}
