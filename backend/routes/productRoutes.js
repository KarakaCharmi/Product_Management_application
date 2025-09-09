import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products (with optional search + sort)
router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!name || price == null || price < 0) {
      return res.status(400).json({ error: "Invalid product data" });
    }
    const product = new Product({ name, price, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
