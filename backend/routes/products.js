import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products (optionally sort by price)
router.get("/", async (req, res) => {
  try {
    const { sort, search } = req.query;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; 
    }

    let products = Product.find(query);

    if (sort === "price-asc") products = products.sort({ price: 1 });
    else if (sort === "price-desc") products = products.sort({ price: -1 });

    const result = await products;
    res.json(result); // <-- always return array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});



// ✅ PUT update product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and Price are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// POST new product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const newProduct = new Product({ name, price, description, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;