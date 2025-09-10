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
  const [confirmDelete, setConfirmDelete] = useState({ open: false, productId: null })
  const [toast, setToast] = useState({ message: "", type: "" }) 

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
      showToast(" Product updated successfully!", "success")
    } catch (err) {
      console.error("❌ Failed to update product:", err)
      showToast(" Failed to update product", "error")
    }
  }

  const confirmDeleteProduct = (id) => {
    setConfirmDelete({ open: true, productId: id })
  }

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${confirmDelete.productId}`, { method: "DELETE" })
      fetchProducts()
      showToast(" Product deleted successfully!", "success")
    } catch (err) {
      console.error("❌ Failed to delete product:", err)
      showToast(" Failed to delete product", "error")
    } finally {
      setConfirmDelete({ open: false, productId: null })
    }
  }

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: "", type: "" }), 3000) // hide after 3s
  }

  return (
    <div className="products-page">
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

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
              onDelete={() => confirmDeleteProduct(p._id)}
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

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={handleClose}
          onSave={updateProduct}
        />
      )}

      {confirmDelete.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button onClick={handleDelete} style={{ background: "#dc2626", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Yes</button>
                <button onClick={() => setConfirmDelete({ open: false, productId: null })} style={{ padding: "0.5rem 1rem", borderRadius: "8px" }}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
