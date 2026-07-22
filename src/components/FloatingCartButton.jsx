import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function FloatingCartButton({
  onClick,
}) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-white shadow-xl"
    >
      <FaShoppingCart size={24} />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-xs">
          {totalItems}
        </span>
      )}
    </button>
  );
}