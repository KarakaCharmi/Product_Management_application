import ProductCard from './ProductCard';
import './ProductList.css';

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="spinner" />
      <div className="loader-text">Loading products...</div>
    </div>
  );
}

export default function ProductList({ products, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <div className="products-list-wrapper">
        <Loader />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="products-list-wrapper">
        <div className="empty panel">
          <div className="empty-emoji">🛍️</div>
          <h3>No products yet</h3>
          <p>Add your first product using the form above.</p>
        </div>
      </div>
    );
  }

  return <div className="products-list">{products.map(p => (
    <ProductCard key={p._id} product={p} onDelete={onDelete} onEdit={onEdit} />
  ))}</div>;
}
