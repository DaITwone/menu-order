import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";
import { useCart } from "../context/CartContext";

function ProductModalContent({ product, onClose }) {
  const hasSize = !!product.sizes;
  const defaultSize = hasSize ? Object.keys(product.sizes)[0] : null;

  const [size, setSize] = useState(defaultSize);
  const [note] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Controls the slide-up / slide-down transition.
  // Sheet starts off-screen, then animates in on mount.
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setVisible(false);
    setTimeout(onClose, 280); // match transition duration below
  };

  const basePrice = hasSize ? product.sizes[size] : product.price;
  const total = basePrice * quantity;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-colors duration-300 ${
        visible && !closing ? "bg-black/50" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full max-w-md flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl transition-transform duration-300 ease-out sm:mb-6 sm:rounded-b-[28px] ${
          visible && !closing ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "92vh" }}
      >
        <div className="relative bg-gradient-to-b from-yellow-50 to-white">
          <button
            onClick={handleClose}
            className="absolute right-4 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow active:scale-90"
            aria-label="Đóng"
          >
            ✕
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="mx-auto h-52 object-contain p-6"
          />
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 pb-2">
          <h2 className="text-xl font-bold leading-tight">{product.name}</h2>

          {hasSize && (
            <div>
              <p className="mb-2 font-semibold text-gray-700">Size</p>
              <div className="flex gap-3">
                {Object.entries(product.sizes).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSize(key)}
                    className={`relative flex-1 rounded-2xl border-2 p-3.5 text-center transition-all active:scale-95 ${
                      size === key
                        ? "border-yellow-500 bg-yellow-50 shadow-sm"
                        : "border-gray-100 bg-gray-50/50 hover:border-yellow-200"
                    }`}
                  >
                    {size === key && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[11px] font-bold text-white shadow">
                        ✓
                      </span>
                    )}
                    <div
                      className={`text-base font-bold ${
                        size === key ? "text-yellow-700" : "text-gray-700"
                      }`}
                    >
                      {key}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {formatPrice(value)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 font-semibold text-gray-700">Số lượng</p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border text-xl text-gray-600 active:scale-90 active:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center text-2xl font-bold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500 text-xl text-white shadow-sm active:scale-90 active:bg-yellow-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Sticky footer with safe-area padding for iOS home indicator */}
        <div
          className="bg-white p-4"
          style={{
            borderTop: "1.5px",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              Tổng cộng:
            </span>
            <span className="text-2xl font-bold text-yellow-600">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-200 py-3.5 font-semibold text-gray-700 active:scale-95"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                addItem({
                  id: crypto.randomUUID(),
                  productId: product.id,
                  name: product.name,
                  image: product.image,
                  size,
                  quantity,
                  note,
                  total,
                });
                handleClose();
              }}
              className="flex-1 rounded-xl bg-yellow-500 py-3.5 font-bold text-white shadow-sm transition active:scale-95 active:bg-yellow-600"
            >
              Thêm món
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({ product, open, onClose }) {
  if (!open || !product) return null;

  return (
    <ProductModalContent
      key={product.id ?? product.name}
      product={product}
      onClose={onClose}
    />
  );
}
