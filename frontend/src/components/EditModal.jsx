import { useState } from "react";
import "./EditModal.css";

const categories = [
  'Fashion',
  'Electronics',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Health & Beauty',
  'Toys & Games',
  'Grocery',
  'Food',
  'Other'
];

function EditForm({ product, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || "Other",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, price: Number(form.price) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="edit-form">
      <div className="form-row">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Price (INR)</label>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button className="btn btn-green" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-gray" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function EditModal({ product, onClose, onSave }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <EditForm product={product} onCancel={onClose} onSave={onSave} />
        </div>
      </div>
    </div>
  );
}
