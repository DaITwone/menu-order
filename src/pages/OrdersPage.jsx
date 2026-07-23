import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";

// Same design language as CartDrawer: order slips torn off a printer roll.
const PAPER = "#FFFBF6";
const INK = "#2A2420";
const CHILI = "#D6472B";
const MUSTARD = "#E8A93A";
const SAGE = "#7C8863";
const RULE = "#DED2BE";
const CANVAS = "#EFE8DA";

const PAYMENT_METHOD_LABELS = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
};

const tornEdge = {
  height: "14px",
  width: "100%",
  background: PAPER,
  clipPath:
    "polygon(0% 100%,4% 15%,8% 100%,12% 15%,16% 100%,20% 15%,24% 100%,28% 15%,32% 100%,36% 15%,40% 100%,44% 15%,48% 100%,52% 15%,56% 100%,60% 15%,64% 100%,68% 15%,72% 100%,76% 15%,80% 100%,84% 15%,88% 100%,92% 15%,96% 100%,100% 15%,100% 100%)",
};

const tornEdgeFlipped = {
  ...tornEdge,
  transform: "rotate(180deg)",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // Tracks which order is in "confirm delete" state — null when none.
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    let active = true;

    fetch("/api/orders")
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải lịch sử đơn hàng.");
        return response.json();
      })
      .then((savedOrders) => {
        if (active) setOrders(savedOrders);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const requestDelete = (orderId) => {
    setConfirmingId(orderId);
  };

  const cancelDelete = () => {
    setConfirmingId(null);
  };

  const confirmDelete = async (orderId) => {
    try {
      const response = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa hóa đơn.");
      setOrders((current) => current.filter((order) => order.id !== orderId));
      setConfirmingId(null);
    } catch (error) {
      setLoadError(error.message);
      setConfirmingId(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: CANVAS }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Space+Mono:wght@400;700&display=swap');`}
      </style>

      {/* Header */}
      <header
        className="px-4 py-6 text-center sm:py-8"
        style={{ background: INK }}
      >
        <h1
          className="text-2xl font-bold uppercase tracking-widest text-white sm:text-3xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          🧾 Đơn hàng
        </h1>
        <p
          className="mt-1 text-xs uppercase tracking-[0.3em]"
          style={{ color: MUSTARD, fontFamily: "'Space Mono', monospace" }}
        >
          Lịch sử order
        </p>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        {isLoading ? (
          <div className="py-16 text-center text-sm" style={{ color: `${INK}99` }}>
            Đang tải hóa đơn...
          </div>
        ) : loadError ? (
          <div className="py-16 text-center text-sm text-red-700" role="alert">
            {loadError}
          </div>
        ) : orders.length === 0 ? (
          <div
            className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center"
            style={{ borderColor: RULE, background: PAPER }}
          >
            <div className="text-5xl grayscale opacity-40">🧾</div>
            <p className="mt-4 text-sm" style={{ color: `${INK}66` }}>
              Chưa có đơn hàng nào được tạo.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const isConfirming = confirmingId === order.id;
              return (
                <div
                  key={order.id}
                  className="mx-auto w-full max-w-md drop-shadow-sm"
                >
                  {/* Torn top edge */}
                  <div style={tornEdge} />

                  <div className="px-5 pb-5 pt-4" style={{ background: PAPER }}>
                    {/* Ticket header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2
                          className="text-lg font-bold uppercase tracking-wide"
                          style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {order.code}
                        </h2>
                        <p
                          className="mt-0.5 text-xs"
                          style={{ color: SAGE, fontFamily: "'Space Mono', monospace" }}
                        >
                          {order.createdAt}
                        </p>
                      </div>
                      <span
                        className="flex h-7 shrink-0 -rotate-3 items-center rounded-full px-2.5 text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: MUSTARD, color: INK }}
                      >
                        Đã đặt
                      </span>
                    </div>

                    <div
                      className="mt-4 border-t border-dashed"
                      style={{ borderColor: RULE }}
                    />

                    <div className="flex items-center justify-between py-3 text-xs">
                      <span
                        className="font-bold uppercase tracking-wider"
                        style={{ color: `${INK}99` }}
                      >
                        Thanh toán
                      </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {PAYMENT_METHOD_LABELS[order.paymentMethod] || "Tiền mặt"}
                      </span>
                    </div>

                    {/* Items */}
                    <div>
                      {order.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 border-dashed py-3"
                          style={{
                            borderColor: RULE,
                            borderBottomWidth:
                              idx === order.items.length - 1 ? 0 : 1,
                          }}
                        >
                          <div className="min-w-0">
                            <span
                              className="text-sm font-bold uppercase tracking-wide"
                              style={{ color: INK, fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {item.name}
                            </span>
                            <div
                              className="mt-0.5 text-xs"
                              style={{ color: SAGE }}
                            >
                              Size {item.size} · x{item.quantity}
                            </div>
                          </div>
                          <div
                            className="shrink-0 text-sm font-bold tabular-nums"
                            style={{ color: INK, fontFamily: "'Space Mono', monospace" }}
                          >
                            {formatPrice(item.total)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div
                        className=" rounded-xl border border-dashed p-3 text-sm"
                        style={{ borderColor: RULE, color: `${INK}CC` }}
                      >
                        {order.note}
                      </div>
                    )}


                    {/* Delete action — single control, min 44px touch target.
                        Tapping swaps into an inline confirm row instead of a
                        native confirm() dialog, which reads poorly on mobile
                        and blocks the whole page. */}
                    <div className="">
                      {isConfirming ? (
                        <div
                          className="flex items-stretch gap-2 rounded-xl border border-dashed p-1.5"
                          style={{ borderColor: CHILI }}
                        >
                          <span
                            className="flex flex-1 items-center px-2 text-xs leading-tight"
                            style={{ color: INK }}
                          >
                            Xóa đơn này?
                          </span>
                          <button
                            onClick={cancelDelete}
                            className="min-h-[44px] shrink-0 rounded-lg px-4 text-xs font-bold uppercase tracking-wider transition active:opacity-60 sm:hover:opacity-70"
                            style={{ background: CANVAS, color: INK }}
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => confirmDelete(order.id)}
                            className="min-h-[44px] shrink-0 rounded-lg px-4 text-xs font-bold uppercase tracking-wider text-white transition active:opacity-80 sm:hover:opacity-90"
                            style={{ background: CHILI }}
                            autoFocus
                          >
                            Xác nhận
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => requestDelete(order.id)}
                          className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition active:opacity-60 sm:hover:opacity-70"
                          style={{ color: CHILI }}
                        >
                          Xóa đơn này
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Torn bottom edge */}
                  <div style={tornEdgeFlipped} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}