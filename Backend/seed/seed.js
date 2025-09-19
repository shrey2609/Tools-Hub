import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../models/Tool.js";
import defaultTools from "./defaultTools.js"; // the file containing your 15 tools

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected for seeding"))
  .catch((err) => console.error(" MongoDB connection error:", err));

const seedTools = async () => {
  try {
    for (let tool of defaultTools) {
      // check if tool already exists
      const exists = await Tool.findOne({ id: tool.id });
      if (!exists) {
        await Tool.create(tool);
        console.log(`Tool added: ${tool.name}`);
      } else {
        console.log(`Tool already exists: ${tool.name}`);
      }
    }
    console.log("Seeding complete!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.connection.close();
  }
};

seedTools();
