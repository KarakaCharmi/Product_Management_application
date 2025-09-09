import ProductCard from './ProductCard';

function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" />
      <div style={{ color: 'var(--muted)', marginTop: '.5rem' }}>Loading products...</div>
    </div>
  );
}

export default function ProductList({ products, onDelete, onEdit, loading }) {
  if (loading) {
    return <Loader />;
  }

  if (!products.length) {
    return (
      <div className="empty panel">
        <div className="empty-emoji">🛍️</div>
        <h3>No products yet</h3>
        <p>Add your first product using the form above.</p>
      </div>
    );
  }

  return (
    <div className="products-list">
      {products.map((p) => (
        <ProductCard
          key={p._id} // stable key
          product={p}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
