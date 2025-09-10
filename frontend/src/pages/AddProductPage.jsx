import { useState, useEffect } from "react"
import AddProductForm from "../components/AddProductForm"
import RecentProducts from "./RecentProducts"
import PriorityProducts from "./PriorityProducts"
import { useMemo } from 'react';
const API_URL = "http://localhost:5000/api/products"

export default function AddProductPage({ onCreate, products = [], setProducts}) {
  const [loading, setLoading] = useState(false)

  // Fetch all products on mount
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        console.log("Last 2 products from server:", data.slice(-2))
        if (setProducts) setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchRecentProducts()
  }, [setProducts])

  const handleCreate = async (product) => {
    setLoading(true)
    try {
      const newProduct = await onCreate(product)
      if (setProducts && newProduct) {
        setProducts((prev) => [newProduct, ...prev])
      }
    } catch (err) {
      console.error("Failed to add product:", err)
    } finally {
      setLoading(false)
    }
  }


const highCostProducts = useMemo(() => {
  return [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 2);
}, [products]);

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {/* Left: Add Product Form */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        <AddProductForm onCreate={handleCreate} loading={loading} />
      </div>

      {/* Right: Recently Added + Search History */}
      <div style={{ flex: 1, minWidth: "250px" }}>
        <RecentProducts products={products} />
        <PriorityProducts products={highCostProducts} title="High-Cost Products" />
      </div>
    </div>
  )
}
