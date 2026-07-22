import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";

export default function CartDrawer({ open, onClose }) {
  const { cart, totalPrice, increase, decrease, removeItem } = useCart();

  const [orderNote, setOrderNote] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-[slide_.25s_ease] flex-col bg-gray-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-5 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">🛒 Giỏ hàng</h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {cart.length === 0 && (
            <div className="mt-20 text-center text-gray-400">
              <div className="text-6xl">🛒</div>

              <p className="mt-4 text-lg">Giỏ hàng đang trống</p>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Size: {item.size}
                  </p>

                  {item.note && (
                    <p className="mt-1 text-sm italic text-gray-400">
                      📝 {item.note}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm font-medium text-red-500 transition hover:text-red-700"
                >
                  Xóa
                </button>
              </div>

              <div className="mt-5 flex items-center">
                <div className="flex items-center rounded-full border">
                  <button
                    onClick={() => decrease(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-l-full transition hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="w-10 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increase(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-r-full transition hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="ml-auto text-lg font-bold text-yellow-600">
                  {formatPrice(item.total)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-5 shadow-[0_-5px_20px_rgba(0,0,0,.05)]">
          {/* Ghi chú đơn hàng */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              📝 Ghi chú
            </label>

            <textarea
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Ví dụ: Gọi trước khi giao, không lấy muỗng..."
              className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium">Tổng cộng</span>

            <span className="text-2xl font-bold text-yellow-600">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button className="w-full rounded-xl bg-yellow-500 py-4 text-lg font-bold text-white transition hover:bg-yellow-600 active:scale-[0.98]">
            Tạo đơn
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slide {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}
