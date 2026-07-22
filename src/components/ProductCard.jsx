import { formatPrice } from "../utils/currency";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg
                flex md:block">
  <img
    src={product.image}
    alt={product.name}
    className="h-28 w-28 flex-shrink-0 object-contain md:h-36 md:w-full"
  />

  <div className="flex flex-1 flex-col justify-between p-3">
    <div>
      <h2 className="font-semibold">{product.name}</h2>

      {product.sizes ? (
        <>
          <div className="text-sm text-gray-500">
            M: {formatPrice(product.sizes.M)}
          </div>

          <div className="text-sm text-gray-500">
            L: {formatPrice(product.sizes.L)}
          </div>
        </>
      ) : (
        <div className="text-sm font-medium text-gray-500">
          {formatPrice(product.price)}
        </div>
      )}
    </div>

    <button
      onClick={onAdd}
      className="mt-3 rounded-lg bg-yellow-500 py-2 text-white"
    >
      Thêm món
    </button>
  </div>
</div>
  );
}
