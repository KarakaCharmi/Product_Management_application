import { useState } from "react"
import "./EditModal.css"
function EditForm({ product, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || "",
  })
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...form, price: Number(form.price) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="row">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>
      <div className="row">
        <label>Price</label>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label>Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label>Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />
      </div>
      <div className="actions">
        <button className="button-green" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="button-gray" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function EditModal({ product, onClose, onSave }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <EditForm product={product} onCancel={onClose} onSave={onSave} />
        </div>
      </div>
    </div>
  )
}
