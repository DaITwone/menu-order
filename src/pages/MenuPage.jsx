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
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 bg-[#F8C810] shadow">
        <img
          src="/images/logo.png"
          alt="OB Cafe"
          className="h-32 w-full object-contain"
        />
      </header>

      <div className="mx-auto max-w-7xl p-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menu.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAdd={() => setSelectedProduct(item)}
            />
          ))}
        </div>
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
