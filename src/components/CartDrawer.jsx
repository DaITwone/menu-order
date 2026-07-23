import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useNavigate } from "react-router-dom";

// Design language: an order slip / receipt torn fresh off the printer.
// Paper cream, ink charcoal, chili-red for action, mustard for the count stamp.
const PAPER = "#FFFBF6";
const INK = "#2A2420";
const CHILI = "#D6472B";
const MUSTARD = "#E8A93A";
const SAGE = "#7C8863";
const RULE = "#DED2BE";

export default function CartDrawer({ open, onClose }) {
  const { cart, totalPrice, increase, decrease, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const createOrder = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: orderNote,
          items: cart,
          total: totalPrice,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.error ||
            (response.status === 404
              ? "Không tìm thấy API. Hãy chạy bằng vercel dev hoặc deploy lại Vercel."
              : "Không thể lưu hóa đơn."),
        );
      }

      clearCart();
      setOrderNote("");
      setPaymentMethod("CASH");
      onClose();
      navigate("/orders");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-[#1D1712]/60 backdrop-blur-sm sm:items-stretch sm:justify-end"
      onClick={onClose}
    >
      <div
        className="
    relative
    flex
    h-full
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
            <button
              onClick={() => {
                onClose();
                navigate("/orders");
              }}
              className="transition hover:opacity-70"
            >
              <h2
                className="text-xl font-bold uppercase tracking-wide sm:text-2xl"
                style={{
                  color: INK,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                🧾 Đơn của bạn
              </h2>
            </button>

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
      <div className="flex items-center gap-2 min-w-0">
        <h3
          className="truncate text-sm font-bold"
          style={{
            color: INK,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {item.name}
        </h3>

        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            background: `${SAGE}18`,
            color: SAGE,
          }}
        >
          {item.size}
        </span>
      </div>

      <span
        className="shrink-0 text-base font-bold tabular-nums"
        style={{
          color: INK,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {formatPrice(item.total)}
      </span>
    </div>

    <div className="mt-3">
      <div
        className="inline-flex items-center rounded-full border"
        style={{ borderColor: `${INK}26` }}
      >
        <button
          onClick={() => decrease(item.id)}
          aria-label="Giảm số lượng"
          className="flex h-8 w-8 items-center justify-center text-base transition active:bg-black/5 hover:bg-black/5"
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
          className="flex h-8 w-8 items-center justify-center text-base transition active:bg-black/5 hover:bg-black/5"
          style={{ color: INK }}
        >
          +
        </button>
      </div>
    </div>
  </div>
))}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-5 pt-4"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
          }}
        >
          <div
            className="border-t border-dashed pt-4"
            style={{ borderColor: RULE }}
          >
            <fieldset>
              <legend
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em]"
                style={{ color: `${INK}99` }}
              >
                Chọn phương thức thanh toán
              </legend>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "CASH",
                    title: "Tiền mặt",
                    subtitle: "Thanh toán",
                  },
                  {
                    value: "BANK_TRANSFER",
                    title: "Chuyển khoản",
                    subtitle: "QR / Banking",
                  },
                ].map((method) => {
                  const active = paymentMethod === method.value;

                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className="relative rounded-xl border px-3 py-2.5 text-left transition-all duration-200 active:scale-95"
                      style={{
                        borderColor: active ? CHILI : RULE,
                        background: active
                          ? "linear-gradient(135deg,#FFF6F3,#FFE5DE)"
                          : "#fff",
                        boxShadow: active
                          ? "0 6px 16px rgba(214,71,43,.12)"
                          : "0 2px 6px rgba(0,0,0,.04)",
                      }}
                    >
                      {active && (
                        <div
                          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white"
                          style={{ background: CHILI }}
                        >
                          ✓
                        </div>
                      )}

                      <div className="text-base">{method.icon}</div>

                      <div
                        className="mt-1 text-sm font-bold"
                        style={{
                          color: active ? CHILI : INK,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {method.title}
                      </div>

                      <div
                        className="text-[10px]"
                        style={{ color: `${INK}88` }}
                      >
                        {method.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label
              className="mb-1.5 mt-4 block text-[11px] font-bold uppercase tracking-wider"
              style={{ color: `${INK}99` }}
            >
              Ghi chú cho quán
            </label>
            <textarea
              rows={2}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Gọi trước khi giao, không lấy muỗng..."
              className="w-full resize-none rounded-xl border p-3 text-sm outline-none transition"
              style={{ borderColor: RULE, background: "#fff" }}
              onFocus={(e) => {
                e.target.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              onBlur={(e) => (e.target.style.borderColor = RULE)}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: INK }}
            >
              Tổng cộng:
            </span>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: INK, fontFamily: "'Space Mono', monospace" }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>

          {submitError && (
            <p className="mb-3 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          )}

          {/* Ticket-stub button: circular notches punched at both ends */}
          <div className="relative">
            <button
              onClick={createOrder}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full rounded-xl py-3 text-base font-bold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: CHILI,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {isSubmitting ? "Đang lưu..." : "Tạo đơn"}
            </button>
            <span
              className="absolute -left-2.25 top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full"
              style={{ background: PAPER }}
            />
            <span
              className="absolute -right-2.25 top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full"
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
