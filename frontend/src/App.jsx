import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import AddProductForm from "./components/AddProductForm";
import ProductList from "./components/ProductList";
import EditModal from "./components/EditModal";

import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [editing, setEditing] = useState(null);

  // Fetch products from backend
  const fetchProducts = async (currentQuery = query, currentSort = sort) => {
    setLoading(true);
    try {
      const params = {};
      if (currentQuery) params.q = currentQuery;
      if (currentSort) params.sort = currentSort;
      const { data } = await axios.get("/api/products", { params });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch whenever query or sort changes
  useEffect(() => {
    fetchProducts(query, sort);
  }, [query, sort]);
const handleSortChange = (newSort) => {
  const scrollY = window.scrollY; // save scroll
  setSort(newSort);
  fetchProducts(query, newSort);  // fetch with new sort
  window.scrollTo(0, scrollY);    // restore scroll
};
  const createProduct = async (payload) => {
    await axios.post("/api/products", payload);
    fetchProducts(query, sort);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`/api/products/${id}`);
    fetchProducts(query, sort);
  };

  const saveEdit = async (updated) => {
    if (!editing) return;
    await axios.put(`/api/products/${editing._id}`, updated);
    setEditing(null);
    fetchProducts(query, sort);
  };

  const productsSorted = useMemo(() => products, [products]);

  return (
    <div className="app-container">
      <Header />

      <AddProductForm onCreate={createProduct} />

      <Toolbar
  query={query}
  sort={sort}
  onSearch={(newQuery) => {
    setQuery(newQuery);
    fetchProducts(newQuery, sort);
  }}
  onSortChange={handleSortChange}
/>


      <ProductList
        products={productsSorted}
        onDelete={deleteProduct}
        onEdit={setEditing}
        loading={loading}
      />

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

export default App;
