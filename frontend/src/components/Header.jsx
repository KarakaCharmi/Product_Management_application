import { ShoppingBag } from "lucide-react"
import "./Header.css"
export default function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="badge">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1>Product Management System</h1>
            <div className="subtitle">Manage and explore your catalog easily</div>
          </div>
        </div>
      </div>
    </div>
  )
}
