import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function FloatingCartButton({ onClick }) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white shadow-xl"
    >
      <FaShoppingCart size={24} />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
