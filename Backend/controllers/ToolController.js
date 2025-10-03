// controllers/ToolController.js
import Tool from "../models/Tool.js";
import defaultTools from "../seed/defaultTools.js";

// GET all tools
export const getTools = async (req, res) => {
  try {
    const tools = await Tool.find();

    // If DB empty → seed default tools
    if (tools.length === 0) {
      console.log("⚠️  Database empty. Seeding default tools...");
      const insertedTools = await Tool.insertMany(defaultTools);
      console.log(
        `✅ ${insertedTools.length} default tools seeded successfully.`
      );
      return res.json(insertedTools);
    }

    console.log(`✅ Fetched ${tools.length} tools from database`);
    res.json(tools);
  } catch (err) {
    console.error("❌ Error fetching tools:", err.message);
    // Only fallback to defaultTools if explicitly needed
    res.status(500).json({
      message: "Error fetching tools from database",
      error: err.message,
    });
  }
};

// GET tool by ID
export const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findOne({ id: req.params.id });
    if (!tool) {
      console.log(`⚠️  Tool not found: ${req.params.id}`);
      return res.status(404).json({ message: "Tool not found" });
    }
    console.log(`✅ Found tool: ${tool.name}`);
    res.json(tool);
  } catch (err) {
    console.error("❌ Error fetching tool:", err.message);
    res.status(500).json({
      message: "Error fetching tool",
      error: err.message,
    });
  }
};

// CREATE a new tool
export const createTool = async (req, res) => {
  try {
    // Check if tool with same ID already exists
    const exists = await Tool.findOne({ id: req.body.id });
    if (exists) {
      return res.status(400).json({
        message: "Tool with this ID already exists",
      });
    }

    const tool = new Tool(req.body);
    const savedTool = await tool.save();
    console.log(`✅ Created new tool: ${savedTool.name}`);
    res.status(201).json(savedTool);
  } catch (err) {
    console.error("❌ Error creating tool:", err.message);
    res.status(400).json({
      message: "Error creating tool",
      error: err.message,
    });
  }
};

// UPDATE a tool by ID
export const updateTool = async (req, res) => {
  try {
    const updatedTool = await Tool.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTool) {
      console.log(`⚠️  Tool not found for update: ${req.params.id}`);
      return res.status(404).json({ message: "Tool not found" });
    }

    console.log(`✅ Updated tool: ${updatedTool.name}`);
    res.json(updatedTool);
  } catch (err) {
    console.error("❌ Error updating tool:", err.message);
    res.status(400).json({
      message: "Error updating tool",
      error: err.message,
    });
  }
};

// DELETE a tool by ID
export const deleteTool = async (req, res) => {
  try {
    const deletedTool = await Tool.findOneAndDelete({ id: req.params.id });

    if (!deletedTool) {
      console.log(`⚠️  Tool not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "Tool not found" });
    }

    console.log(`✅ Deleted tool: ${deletedTool.name}`);
    res.json({
      message: "Tool deleted successfully",
      deletedTool,
    });
  } catch (err) {
    console.error("❌ Error deleting tool:", err.message);
    res.status(500).json({
      message: "Error deleting tool",
      error: err.message,
    });
  }
};
