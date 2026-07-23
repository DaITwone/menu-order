export default function ProductCard({ product, onAdd }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="
        group
        overflow-hidden
        rounded-3xl
        bg-white
        border border-stone-200
        shadow-sm
        transition-all
        duration-200
        active:scale-95
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden p-4">
        <img
          src={product.image}
          alt={product.name}
          className="
            h-full
            w-full
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Product Name */}
      <div className="flex items-center justify-center px-3 py-4">
        <h3
  className="
    text-center
    text-[15px]
    sm:text-base
    font-bold
    leading-snug
    text-stone-900
    line-clamp-2
    transition-colors
    duration-200
    group-hover:text-amber-700
  "
>
  {product.name}
</h3>
      </div>
    </button>
  );
}
