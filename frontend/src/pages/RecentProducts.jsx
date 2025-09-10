import ProductCard from "../components/ProductCard"
import './RecentProducts.css'

export default function RecentProducts({ products }) {
  const recentProducts = products.slice(-2).reverse()
  return (
    <section className="recent-products">
      <h3>Recently Added Products</h3>
      {recentProducts.length > 0 ? (
        <div className="recent-products-list">
          {recentProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
            />
          ))}
        </div>
      ) : (
        <p>No products added yet.</p>
      )}
    </section>
  )
}
