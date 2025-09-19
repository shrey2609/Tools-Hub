
import Tool from "../models/Tool.js";
import defaultTools from "../seed/defaultTools.js";

// GET all tools
export const getTools = async (req, res) => {
  try {
    const tools = await Tool.find();

    // If DB empty → seed default tools with upsert to avoid duplicates
    if (tools.length === 0) {
      console.log("Seeding default tools into MongoDB...");
      for (const t of defaultTools) {
        await Tool.updateOne({ id: t.id }, t, { upsert: true });
      }
      console.log("Default tools seeded successfully.");
      return res.json(defaultTools);
    }

    console.log(`Tools fetched from DB: ${tools.length}`);
    res.json(tools);
  } catch (err) {
    console.error("Error fetching tools:", err.message);
    // If DB down or any error → fallback for frontend
    console.log("Sending default tools as fallback.");
    res.json(defaultTools);
  }
};

// GET tool by ID
export const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findOne({ id: req.params.id });
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tool", error: err.message });
  }
};

// CREATE a new tool
export const createTool = async (req, res) => {
  try {
    const tool = new Tool(req.body);
    const savedTool = await tool.save();
    res.status(201).json(savedTool);
  } catch (err) {
    res.status(400).json({ message: "Error creating tool", error: err.message });
  }
};

// UPDATE a tool by ID
export const updateTool = async (req, res) => {
  try {
    const updatedTool = await Tool.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedTool) return res.status(404).json({ message: "Tool not found" });
    res.json(updatedTool);
  } catch (err) {
    res.status(400).json({ message: "Error updating tool", error: err.message });
  }
};

// DELETE a tool by ID
export const deleteTool = async (req, res) => {
  try {
    const deletedTool = await Tool.findOneAndDelete({ id: req.params.id });
    if (!deletedTool) return res.status(404).json({ message: "Tool not found" });
    res.json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tool", error: err.message });
  }
};

