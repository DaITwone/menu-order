import { useState } from "react";
import { formatPrice } from "../utils/currency";
import { useCart } from "../context/CartContext";

function ProductModalContent({ product, onClose }) {
  const hasSize = !!product.sizes;

  const defaultSize = hasSize ? Object.keys(product.sizes)[0] : null;

  const [size, setSize] = useState(defaultSize);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  const basePrice = hasSize ? product.sizes[size] : product.price;
  const total = basePrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {" "}
        <div className="relative bg-gradient-to-b from-yellow-50 to-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
          >
            ✕
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="mx-auto h-56 object-contain p-6"
          />
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {" "}
          <h2 className="text-2xl font-bold">{product.name}</h2>
          {hasSize && (
            <div>
              <p className="mb-2 font-semibold">Size</p>

              <div className="flex gap-3">
                {Object.entries(product.sizes).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSize(key)}
                    className={`flex-1 rounded-2xl border-2 p-4 transition
    ${
      size === key
        ? "border-yellow-500 bg-yellow-50"
        : "border-gray-200 hover:border-yellow-300"
    }`}
                  >
                    <div className="text-lg font-bold">{key}</div>

                    <div className="mt-1 text-sm text-gray-500">
                      {formatPrice(value)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="mb-2 font-semibold">Số lượng</p>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border text-xl hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-8 text-center text-2xl font-bold">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500 text-xl text-white hover:bg-yellow-600"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold">Ghi chú</p>

            <textarea
              className="w-full rounded-2xl border border-gray-200 p-4 focus:border-yellow-500 focus:outline-none"
              placeholder="Chuyển khoản, Tiền mặt,..."
            />
          </div>
          <div className="bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-600">Tổng cộng:</span>

              <span className="text-2xl font-bold text-yellow-600">
                {formatPrice(total)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border py-4 font-semibold"
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

                  onClose();
                }}
                className="flex-1 rounded-xl bg-yellow-500 py-4 font-bold text-white transition hover:bg-yellow-600 active:scale-95"
              >
                Thêm vào giỏ
              </button>
            </div>
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
