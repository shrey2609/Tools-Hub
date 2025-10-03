// seed/syncTools.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../models/Tool.js";
import defaultTools from "./defaultTools.js";

dotenv.config();

const syncTools = async () => {
  try {
    // Connect without deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for syncing tools");

    // Get all tool IDs from defaultTools
    const defaultToolIds = defaultTools.map((t) => t.id);

    // 1. DELETE tools that are NOT in defaultTools anymore
    const deleteResult = await Tool.deleteMany({
      id: { $nin: defaultToolIds },
    });
    if (deleteResult.deletedCount > 0) {
      console.log(
        `🗑️  Deleted ${deleteResult.deletedCount} tools not in defaultTools`
      );
    }

    // 2. UPSERT (update or insert) all tools from defaultTools
    for (let tool of defaultTools) {
      const updated = await Tool.findOneAndUpdate({ id: tool.id }, tool, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      console.log(`✅ Synced tool: ${tool.name}`);
    }

    console.log("🎉 All tools synced successfully!");

    // Show final count
    const finalCount = await Tool.countDocuments();
    console.log(`📊 Total tools in DB: ${finalCount}`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error syncing tools:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

syncTools();
