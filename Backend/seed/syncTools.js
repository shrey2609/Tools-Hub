// seed/syncTools.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../models/Tool.js";
import defaultTools from "./defaultTools.js";

dotenv.config();

const syncTools = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected for syncing tools");

    for (let tool of defaultTools) {
      const updated = await Tool.findOneAndUpdate(
        { id: tool.id },
        tool,
        { upsert: true, new: true }
      );
      console.log(` Synced tool: ${tool.name}`);
    }

    console.log(" All tools synced successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(" Error syncing tools:", err);
    mongoose.connection.close();
  }
};

syncTools();
