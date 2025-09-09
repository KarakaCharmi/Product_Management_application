import './ProductCard.css'
function displayImage(product) {
	const cat = String(product.category || '').toLowerCase()
	if (product.imageUrl) return product.imageUrl
	if (cat.includes('shoe')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
	if (cat.includes('grocery') || cat.includes('food')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
	if (cat.includes('electronics')) return 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop'
	return 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop'
}

function badgeClass(category) {
	const c = String(category || '').toLowerCase()
	if (c.includes('food') || c.includes('grocery')) return 'category-badge green'
	if (c.includes('electronics')) return 'category-badge amber'
	if (c.includes('shoe') || c.includes('fashion')) return 'category-badge pink'
	return 'category-badge'
}

function currency(value) {
	try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value || 0)) } catch { return `$${value}` }
}

export default function ProductCard({ product, onDelete, onEdit }) {
	const img = displayImage(product)
	return (
		<div className="card" style={{ transition: 'transform .12s ease, box-shadow .12s ease' }}>
			<div className="card-media">
				<img src={img} alt={product.name} />
				{product.category && <span className={badgeClass(product.category)}>{product.category}</span>}
			</div>
			<div className="card-body">
				<div className="card-title">{product.name}</div>
				<div className="card-price">{currency(product.price)}</div>
				<div className="card-desc">{product.description}</div>
				<div className="card-actions">
					<button className="btn-delete" onClick={() => onDelete(product._id)}>Delete</button>
					{onEdit && <button className="btn-edit" onClick={() => onEdit(product)}>Edit</button>}
				</div>
			</div>
		</div>
	)
}


