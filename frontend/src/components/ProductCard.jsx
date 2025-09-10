import './ProductCard.css';
import { Trash2, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

const UNSPLASH_ACCESS_KEY =import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function ProductCard({ product, onDelete, onEdit }) {
  const [img, setImg] = useState("");

  useEffect(() => {
    async function fetchImage() {
      try {
        if (product.imageUrl) {
          setImg(product.imageUrl);
          return;
        }
        const query = encodeURIComponent(product.name || product.category || "product");

        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setImg(data.results[0].urls.small);
        } else {
          // Fallback default image
          setImg("https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop");
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setImg("https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop");
      }
    }

    fetchImage();
  }, [product]);

  function badgeClass(category) {
  const c = String(category || '').toLowerCase(); // all lowercase
  if (c.includes('food') || c.includes('grocery')) return 'category-badge green';
  if (c.includes('electronics')) return 'category-badge gray';
  if (c.includes('sports & outdoors')) return 'category-badge pink';
  if (c.includes('fashion')) return 'category-badge purple';
  if (c.includes('health & beauty')) return 'category-badge red';
  if (c.includes('toys & games')) return 'category-badge orange';
  if (c.includes('home & kitchen')) return 'category-badge yellow';
  return 'category-badge teal';
}


  function currency(value) {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0)) } 
    catch { return `₹${value}` }
  }

  return (
    <div className="card" style={{ transition: 'transform .12s ease, box-shadow .12s ease' }}>
     <div className="card-media">
  {img ? (
    <img src={img} alt={product.name} className="card-img" />
  ) : (
    <div className="skeleton shimmer"></div>
  )}
  
  {product.category && (
    <span className={`category-badge ${badgeClass(product.category)}`}>
      {product.category}
    </span>
  )}


  <div className="card-overlay" />
</div>

      <div className="card-body">
        <div className="card-title">{product.name}</div>
        <div className="card-price">{currency(product.price)}</div>
        <div className="card-desc">{product.description}</div>
        <div className="card-actions">
			{onDelete && (
          <button className="btn-delete" onClick={() => onDelete(product._id)}>
            <Trash2 size={16} /> <span>Delete</span>
          </button>)}

          {onEdit && (
            <button className="btn-edit" onClick={() => onEdit(product)}>
              <Edit3 size={16} /> <span>Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
