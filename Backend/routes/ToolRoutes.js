// Backend/routes/toolRoutes.js

import express from "express";
import {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
} from "../controllers/ToolController.js";

const router = express.Router();

// GET all tools
router.get("/", getTools);

// GET a single tool by ID
router.get("/:id", getToolById);

// POST a new tool
router.post("/", createTool);

// PUT update a tool by ID
router.put("/:id", updateTool);

// DELETE a tool by ID
router.delete("/:id", deleteTool);

export default router;
