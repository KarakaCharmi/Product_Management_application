import ProductCard from "../components/ProductCard"

export default function PriorityProducts({ products, title = "Products" }) {
  // Just use the array passed from parent
  const topProducts = products

  return (
    <section className="recent-products">
      <h3>{title}</h3>
      {topProducts.length > 0 ? (
        <div className="recent-products-list">
          {topProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <p>No products to show.</p>
      )}
    </section>
  )
}
