import { menu } from "../data/menu";
import ProductCard from "../components/ProductCard";
import { useMemo, useState } from "react";
import ProductModal from "../components/ProductModal";
import FloatingCartButton from "../components/FloatingCartButton";
import CartDrawer from "../components/CartDrawer";
import {
  FaBorderAll,
  FaGlassWater,
  FaLeaf,
  FaMugSaucer,
} from "react-icons/fa6";

export default function MenuPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filterButtons = [
    {
      id: "all",
      icon: FaBorderAll,
      label: "Tất cả",
    },
    {
      id: "coffee",
      icon: FaMugSaucer,
      label: "Cà phê",
    },
    {
      id: "tea",
      icon: FaLeaf,
      label: "Trà",
    },
    {
      id: "milktea",
      icon: FaGlassWater,
      label: "Trà sữa",
    },
  ];

  const filteredMenu = useMemo(() => {
    if (selectedCategory === "all") return menu;

    return menu.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-stone-800">
      <main className="mx-auto max-w-7xl px-3 pb-28 pt-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMenu.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAdd={() => setSelectedProduct(item)}
            />
          ))}
        </div>
      </main>

      <div className="fixed right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 rounded-full border border-white/70 bg-white/45 p-2 backdrop-blur-md">
        {filterButtons.map((button) => {
          const Icon = button.icon;
          const isActive = selectedCategory === button.id;

          return (
            <button
              key={button.id}
              type="button"
              onClick={() => setSelectedCategory(button.id)}
              title={button.label}
              aria-label={button.label}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                isActive
                  ? "border-amber-500 bg-amber-500 text-white shadow-lg"
                  : "border-white/80 bg-white/55 text-stone-700 shadow-sm hover:bg-white/90"
              }`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <ProductModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <FloatingCartButton onClick={() => setCartOpen(true)} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
