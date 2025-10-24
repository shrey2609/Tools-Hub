import Zoho from "../models/zohoRM.js";
import axios from "axios";
import qs from "qs";
import { getAccessToken } from "../seed/zohohelper.js";
import dotenv from "dotenv";

dotenv.config();

const ZOHO_BASE_URL = process.env.ZOHO_BASE_URL;


// Function to get/refresh Zoho Access Token
export const getOauthToken = async (req, res) => {
  try {
    const data = qs.stringify({
      grant_type: "authorization_code",
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: process.env.ZOHO_REDIRECT_URI,
      code: process.env.ZOHO_CODE,
      access_type: "offline",
      prompt: "consent"
    });

    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    await Zoho.findOneAndUpdate(
      { key: 'zoho-global-token' },
      {
        access_token,
        refresh_token,
        expires_in,
        last_updated: new Date(),
        key: 'zoho-global-token',
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Tokens fetched successfully",
      access_token,
      refresh_token,
    });
  } catch (error) {
    console.error(
      "Error fetching oauth token from Zoho People:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to fetch OAuth token" });
  }
};

// fetches the employee reporting manager from zoho
export const getReportingManagerEmail = async(email) => {
    const access_token = await getAccessToken();
    
    const employeeResponse = await axios.get(
      `https://people.zoho.in/api/forms/P_EmployeeView/records?searchColumn=EMPLOYEEMAILALIAS&searchValue=${email}`,
      {
        headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    const employeeData = employeeResponse.data;
    if (!employeeData || employeeData.length === 0) {
      throw new Error("No employee found with email")
    }

    const employee = employeeData[0];
    const reportingManagerDetails = employee["Reporting Manager"];

    if (!reportingManagerDetails) {
      throw new Error("No Reporting Manager found.")
    }
    
    const managerId = reportingManagerDetails.split(" ").pop(); 

    const managerResponse = await axios.get(
      `${ZOHO_BASE_URL}searchColumn=Employeeid&searchValue=${managerId}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    const managerData = managerResponse.data;
    if (!managerData || managerData.length === 0) {
      throw new Error("No manager found with id")
    }
    const manager = managerData[0];
    const reportingManagerEmail = manager["Email address"];

    if (!reportingManagerEmail) {
      throw new Error("Manager email not found")
    }

    return reportingManagerEmail;

};
