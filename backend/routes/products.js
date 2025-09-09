import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const { q, sort } = req.query;
		const filter = q ? { name: { $regex: String(q), $options: "i" } } : {};
		const sortSpec = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : { createdAt: -1 };
		const products = await Product.find(filter).sort(sortSpec);
		res.json(products);
	} catch (err) {
		res.status(500).json({ message: "server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { name, price, description, category } = req.body;
		if (!name || price == null) return res.status(400).json({ message: "name and price required" });
		const created = await Product.create({ name, price, description, category });
		res.status(201).json(created);
	} catch (err) {
		res.status(500).json({ message: "server error" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, description, category } = req.body;
		const updated = await Product.findByIdAndUpdate(
			id,
			{ name, price, description, category },
			{ new: true, runValidators: true }
		);
		if (!updated) return res.status(404).json({ message: "not found" });
		res.json(updated);
	} catch (err) {
		res.status(400).json({ message: "update failed" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Product.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ message: "not found" });
		res.json({ message: "deleted" });
	} catch (err) {
		res.status(400).json({ message: "delete failed" });
	}
});

export default router;


