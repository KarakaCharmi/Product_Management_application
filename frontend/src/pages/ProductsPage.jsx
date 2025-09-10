import { useState, useEffect, useCallback } from "react"
import ProductCard from "../components/ProductCard"
import EditModal from "../components/EditModal"
import { ChevronDown, Search, X } from "lucide-react"
import "../App.css"

const API_URL = "http://localhost:5000/api/products"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}?sort=${sort}&search=${encodeURIComponent(search)}`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("❌ Failed to fetch products:", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [sort, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleEdit = (product) => setEditingProduct(product)
  const handleClose = () => setEditingProduct(null)

  const updateProduct = async (product) => {
    if (!editingProduct) return
    try {
      await fetch(`${API_URL}/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      handleClose()
      fetchProducts()
    } catch (err) {
      console.error("❌ Failed to update product:", err)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      fetchProducts()
    } catch (err) {
      console.error("❌ Failed to delete product:", err)
    }
  }

  return (
    <div className="products-page">
      {/* Controls: Search + Sort */}
      <div className="controls">
        <div className="searchbar">
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

          <div className="sort-select">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort by</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
            <ChevronDown className="select-caret" size={18} />
          </div>
        </div>
      </div>

      {/* Product List */}
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
            <p>{search ? `No matches found for "${search}"` : "Try adding a new product!"}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={handleClose}
          onSave={updateProduct}
        />
      )}
    </div>
  )
}
