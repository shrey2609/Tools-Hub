import mongoose from "mongoose";

const zohoSchema = new mongoose.Schema({
    key: { type: String,required: true, unique: true },
    email: { type: String, required: true },
    employeeId:{type:String},
    reportingManagerEmail:{type: String},
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    last_updated: { type: Date, default: Date.now }
});
    
const Zoho = mongoose.model("Zoho", zohoSchema);
 export default Zoho;
    

