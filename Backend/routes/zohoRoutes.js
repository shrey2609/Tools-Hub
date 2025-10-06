import express from "express";
import { askPermission } from "../controllers/permission.js";
import { getOauthToken } from "../services/zoho.js";
import { handlePermission } from "../controllers/weebhookPermission.js";
import { getIamRoles } from "../services/IAMpolicy.js";



const router = express.Router()

 // route for get access token
router.post("/", getOauthToken)


 // route for asking permission from frontend.
 router.post("/ask-permission", askPermission);

 // route for handling jira comment webhook.
 router.post("/webhook/handle-permission", handlePermission);


 router.get("/gcp/roles", async (req, res) => {
  try {
    const roles = await getIamRoles();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error.response?.data || error.message);
    res.status(500).json({ error: error.message, details: error.response?.data });
  }
});

export default router;

