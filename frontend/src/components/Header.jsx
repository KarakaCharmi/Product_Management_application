import { ShoppingBag, ShoppingCart } from "lucide-react"
import { NavLink } from "react-router-dom"
import "./Header.css"

export default function Header() {
  return (
    <header className="header">
      <div className="overlay" />
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <div className="logo-badge">
            <ShoppingBag size={28} />
          </div>
          <div className="brand-text">
            <h1>Product Management System</h1>
            <p className="subtitle">Easily manage your product catalog</p>
          </div>
        </div>
        <nav className="nav-tabs">
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Products
          </NavLink>
          <NavLink 
            to="/add" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Add Product
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
