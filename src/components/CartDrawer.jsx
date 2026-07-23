import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";

// Design language: an order slip / receipt torn fresh off the printer.
// Paper cream, ink charcoal, chili-red for action, mustard for the count stamp.
const PAPER = "#FFFBF6";
const INK = "#2A2420";
const CHILI = "#D6472B";
const MUSTARD = "#E8A93A";
const SAGE = "#7C8863";
const RULE = "#DED2BE";

export default function CartDrawer({ open, onClose }) {
  const { cart, totalPrice, increase, decrease, removeItem } = useCart();
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const orderCode = `#${String(Date.now()).slice(-6)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-[#1D1712]/60 backdrop-blur-sm sm:items-stretch sm:justify-end"
      onClick={onClose}
    >
      <div
        className="
    relative
    flex
    h-[100dvh]
    w-full
    flex-col
    overflow-hidden
    shadow-2xl
    animate-[sheet-up_.3s_cubic-bezier(0.32,0.72,0,1)]
    sm:h-full
    sm:max-w-md
    sm:animate-[slide-in_.25s_ease]
  "
        style={{ background: PAPER }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Torn top edge — mobile only, replaces a rounded corner */}
        <div
          className="h-4 w-full shrink-0 sm:hidden"
          style={{
            background: PAPER,
            clipPath:
              "polygon(0% 100%,4% 15%,8% 100%,12% 15%,16% 100%,20% 15%,24% 100%,28% 15%,32% 100%,36% 15%,40% 100%,44% 15%,48% 100%,52% 15%,56% 100%,60% 15%,64% 100%,68% 15%,72% 100%,76% 15%,80% 100%,84% 15%,88% 100%,92% 15%,96% 100%,100% 15%,100% 100%)",
          }}
        />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-2 sm:pt-6">
          <div className="flex items-center gap-2.5">
            <h2
              className="text-xl font-bold uppercase tracking-wide sm:text-2xl"
              style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              🧾 Đơn của bạn
            </h2>
            {cart.length > 0 && (
              <span
                className="flex h-6 min-w-6 -rotate-6 items-center justify-center rounded-full px-1.5 text-xs font-bold"
                style={{
                  background: MUSTARD,
                  color: INK,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {cart.length}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
            className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition active:bg-black/5 sm:h-10 sm:w-10 sm:hover:bg-black/5"
            style={{ color: `${INK}99` }}
          >
            ✕
          </button>
        </div>

        <div
          className="mx-5 shrink-0 border-t border-dashed"
          style={{ borderColor: RULE }}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5">
          {cart.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="text-5xl grayscale opacity-40">🧾</div>
              <p className="mt-4 text-sm" style={{ color: `${INK}66` }}>
                Đơn hàng đang trống.
              </p>
            </div>
          )}

          {cart.map((item, idx) => (
            <div
              key={item.id}
              className="border-dashed py-4"
              style={{
                borderColor: RULE,
                borderBottomWidth: idx === cart.length - 1 ? 0 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3
                    className="truncate text-[15px] font-bold uppercase tracking-wide"
                    style={{
                      color: INK,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: SAGE }}
                  >
                    Size {item.size}
                  </p>
                  {item.note && (
                    <p
                      className="mt-1 truncate text-xs italic"
                      style={{ color: `${INK}66` }}
                    >
                      📝 {item.note}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 rounded-full px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition active:opacity-60 sm:hover:opacity-70"
                  style={{ color: CHILI }}
                >
                  Xóa
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div
                  className="flex items-center rounded-full border"
                  style={{ borderColor: `${INK}26` }}
                >
                  <button
                    onClick={() => decrease(item.id)}
                    aria-label="Giảm số lượng"
                    className="flex h-10 w-10 items-center justify-center text-base transition active:bg-black/5 sm:h-9 sm:w-9 sm:hover:bg-black/5"
                    style={{ color: INK }}
                  >
                    −
                  </button>
                  <span
                    className="w-8 text-center text-sm font-bold tabular-nums"
                    style={{
                      color: INK,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increase(item.id)}
                    aria-label="Tăng số lượng"
                    className="flex h-10 w-10 items-center justify-center text-base transition active:bg-black/5 sm:h-9 sm:w-9 sm:hover:bg-black/5"
                    style={{ color: INK }}
                  >
                    +
                  </button>
                </div>

                <span
                  className="text-base font-bold tabular-nums"
                  style={{ color: INK, fontFamily: "'Space Mono', monospace" }}
                >
                  {formatPrice(item.total)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-5 pt-4"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <div
            className="border-t border-dashed pt-4"
            style={{ borderColor: RULE }}
          >
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
              style={{ color: `${INK}99` }}
            >
              📝 Ghi chú cho quán
            </label>
            <textarea
              rows={2}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Gọi trước khi giao, không lấy muỗng..."
              className="w-full resize-none rounded-xl border p-3 text-sm outline-none transition"
              style={{ borderColor: RULE, background: "#fff" }}
              onFocus={(e) => (e.target.style.borderColor = MUSTARD)}
              onBlur={(e) => (e.target.style.borderColor = RULE)}
            />
          </div>

          <div
            className="mt-4 flex items-center justify-between py-3"
            style={{ borderTop: `3px double ${INK}` }}
          >
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: INK }}
            >
              Tổng cộng
            </span>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: INK, fontFamily: "'Space Mono', monospace" }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>

          {/* Barcode flourish — purely decorative, sells the "order slip" idea */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div
              className="h-6 w-full max-w-[220px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 9px, currentColor 9px, currentColor 12px, transparent 12px, transparent 14px)",
                color: INK,
                opacity: 0.75,
              }}
            />
            <span
              className="text-[10px] tracking-[0.3em]"
              style={{
                color: `${INK}66`,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {orderCode}
            </span>
          </div>

          {/* Ticket-stub button: circular notches punched at both ends */}
          <div className="relative mt-4">
            <button
              disabled={cart.length === 0}
              className="w-full rounded-xl py-4 text-base font-bold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: CHILI,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Tạo đơn
            </button>
            <span
              className="absolute left-[-9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full"
              style={{ background: PAPER }}
            />
            <span
              className="absolute right-[-9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full"
              style={{ background: PAPER }}
            />
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Space+Mono:wght@400;700&display=swap');

          @keyframes sheet-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}
