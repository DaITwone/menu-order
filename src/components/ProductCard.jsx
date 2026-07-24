export default function ProductCard({ product, onAdd }) {

  return (
    <button
      type="button"
      onClick={onAdd}
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[24px]
        border border-stone-200
        bg-white
        text-left
        shadow-sm
        transition-all
        duration-200
        active:scale-[0.98]
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="aspect-square overflow-hidden p-3 sm:p-4">
        <img
          src={product.image}
          alt={product.name}
          className="
            h-full
            w-full
            rounded-2xl
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        <h3
          className="
            text-center
            text-[14px]
            font-bold
            leading-snug
            text-stone-900
            line-clamp-2
            transition-colors
            duration-200
            group-hover:text-amber-700
            sm:text-[15px]
          "
        >
          {product.name}
        </h3>
      </div>
    </button>
  );
}
