import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import AddProductForm from "./components/AddProductForm";
import ProductCard from "./components/ProductCard";
import EditModal from "./components/EditModal";
import "./App.css";
import { ChevronDown,Search, X } from "lucide-react";


const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products (memoized with useCallback)
  // Replace your fetchProducts with this:
const fetchProducts = useCallback(async (showLoading = false) => {
  if (showLoading) setLoading(true); // only show skeleton on first load
  try {
    const res = await fetch(
      `${API_URL}?sort=${sort}&search=${encodeURIComponent(search)}`
    );
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  } finally {
    if (showLoading) setLoading(false);
  }
}, [sort, search]);

// --------------------
// useEffect: first load → show skeleton
useEffect(() => {
  fetchProducts(true); // first load with skeleton
}, []);

// --------------------
// Whenever sort/search changes → fetch but don't reset UI
useEffect(() => {
  if (products.length > 0) {
    fetchProducts(false); // keep showing products, no skeleton blink
  }
}, [sort, search]);

  // ✅ CRUD actions
  const addProduct = async (product) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    fetchProducts();
  };

  const updateProduct = async (product) => {
    if (!editingProduct) return;
    await fetch(`${API_URL}/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  // ✅ Edit modal handlers
  const handleEdit = (product) => setEditingProduct(product);
  const handleCloseModal = () => setEditingProduct(null);

  return (
    <div className="container">
      {/* Header */}
      <Header />

      {/* Add new product */}
      <AddProductForm onCreate={addProduct} />


      {/* Controls: search + sort */}
      <div className="controls">
<div className="searchbar">
  {/* Search box */}
  <div className="searchbox">
  <Search className="search-icon" size={18} />
  <input
    type="text"
    className="search-input"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  {search && (
    <button
      className="searchbox-button"
      onClick={() => setSearch("")}
      type="button"
    >
      <X size={16} />
    </button>
  )}
</div>


  {/* Sort select */}
  <div className="sort-select">
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
  >
    <option value="">Sort by</option>
    <option value="price-asc">Price (Low → High)</option>
    <option value="price-desc">Price (High → Low)</option>
  </select>
  <ChevronDown className="select-caret" size={18} />
</div>

</div>

      </div>

      {/* Product list */}
      <div className="products-list">
        {loading ? (
          <div className="skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card">
                <div className="card-media shimmer" />
                <div className="card-body">
                  <div className="sk-line" />
                  <div className="sk-line sm" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onDelete={deleteProduct}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="empty">
            <div className="empty-emoji">📦</div>
            <h3>No Products</h3>
            <p>
              {search
                ? `No matches found for "${search}"`
                : "Try adding a new product!"}
            </p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={updateProduct}
        />
      )}
    </div>
  );
}

export default App;
