import { menu } from "../data/menu";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import ProductModal from "../components/ProductModal";
import FloatingCartButton from "../components/FloatingCartButton";
import CartDrawer from "../components/CartDrawer";

export default function MenuPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-stone-800">

      {/* Menu */}
      <main className="mx-auto max-w-7xl px-3 py-4 pb-28 sm:px-5 lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {menu.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAdd={() => setSelectedProduct(item)}
            />
          ))}
        </div>
      </main>

      <ProductModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <FloatingCartButton onClick={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}