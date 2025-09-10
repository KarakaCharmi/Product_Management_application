import { useState } from 'react'
import './AddProductForm.css'

export default function AddProductForm({ onCreate }) {
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null) // <-- toast state

  const categories = [
    'Fashion', 'Electronics', 'Home & Kitchen', 'Sports & Outdoors',
    'Health & Beauty', 'Toys & Games', 'Grocery', 'Food', 'Other'
  ]

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || form.price === '') return alert('Name and price are required')
    setLoading(true)
    try {
      const newProduct = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim(),
      }
      await onCreate(newProduct)
      setForm({ name: '', price: '', description: '', category: '' })

      // Show toast
      setToast('Product added successfully!')

      // Keep toast and loading visible for ~2s
      await new Promise(resolve => setTimeout(resolve, 2000))

      setToast(null)      // hide toast
    //   navigate('/products') // navigate after toast
    } catch (err) {
      console.error('Failed to add product:', err)
      setToast('Failed to add product')
      setTimeout(() => setToast(null), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-product-page">
      {/* Toast element */}
      {toast && <div className="toast">{toast}</div>}

      <form onSubmit={handleSubmit} className="product-form card">
        <h2>Add Product</h2>
        <div className="form-grid">
          <div className="row">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Running Shoes"
              required
            />
          </div>
          <div className="row">
            <label>Price</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 79.99"
              required
            />
          </div>
          <div className="row">
            <label>Category</label>
            <div className="select-wrap">
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <label>Description <span className="hint">(optional)</span></label>
            <input
              name="description"
              maxLength={140}
              value={form.description}
              onChange={handleChange}
              placeholder="Short summary (max 140 chars)"
            />
          </div>
        </div>
        <div className="actions actions-right">
          <button className="btn-green" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
