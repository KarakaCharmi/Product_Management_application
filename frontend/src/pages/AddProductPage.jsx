import { useState, useEffect, useMemo } from "react"
import AddProductForm from "../components/AddProductForm"
import RecentProducts from "./RecentProducts"
import PriorityProducts from "./PriorityProducts"

const API_URL = "http://localhost:5000/api/products"

export default function AddProductPage({ onCreate, products = [], setProducts }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        if (setProducts) setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchProducts()
  }, [setProducts])

  const handleCreate = async (product) => {
    setLoading(true)
    try {
      const newProduct = await onCreate(product)
      if (setProducts && newProduct) {
        setProducts((prev) => [newProduct, ...prev]);

      }
    } catch (err) {
      console.error("Failed to add product:", err)
    } finally {
      setLoading(false)
    }
  }

  const highCostProducts = useMemo(() => {
    const uniqueProducts = Array.from(new Map(products.map(p => [p._id, p])).values())
    return uniqueProducts
      .sort((a, b) => b.price - a.price)
      .slice(0, 2)
  }, [products])

const recentProducts = useMemo(() => {
  return products.slice(-2) 
}, [products])

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <AddProductForm onCreate={handleCreate} loading={loading} />
      </div>
      <div style={{ flex: 1, minWidth: "250px" }}>
        <RecentProducts products={recentProducts} title="Recently Added" />
        <PriorityProducts products={highCostProducts} title="High-Cost Products" />
      </div>
    </div>
  )
}
