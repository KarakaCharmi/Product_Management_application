import { Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import ProductsPage from "./pages/ProductsPage"
import AddProductPage from "./pages/AddProductPage"
import { useState, useEffect } from "react"

const API_URL = "http://localhost:5000/api/products"

export default function App() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchProducts()
  }, [])
  const addProduct = async (product) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    const newProduct = await res.json()
    setProducts((prev) => [...prev, newProduct]) 
    return newProduct
  }

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage products={products} setProducts={setProducts} />} />
          <Route path="/add" element={<AddProductPage onCreate={addProduct} products={products} setProducts={setProducts} />} />
        </Routes>
      </main>
    </div>
  )
}
