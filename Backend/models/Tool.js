// models/Tool.js
import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  about: { type: String },
  signup: { type: String },
  login: { type: String },
  usage: { type: String },
});

const toolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // unique tool id
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }, 
  officialLink: { type: String },
  guide: guideSchema,
});

const Tool = mongoose.model("Tool", toolSchema);

export default Tool;
