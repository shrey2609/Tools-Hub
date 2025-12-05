import Zoho from "../models/zohoRM.js";
import axios from "axios";
import qs from "qs";
// import dotenv from "dotenv";
// dotenv.config();


export const getAccessToken = async () => {
  const tokenData = await Zoho.findOne({ key: "zoho-global-token" });

  if (!tokenData) throw new Error("No Zoho token found in DB");

  const { access_token, refresh_token, last_updated, expires_in } = tokenData;

  const expiryBuffer = 5 * 60 * 1000; 
    
  const expiryTime = new Date(last_updated).getTime() + expires_in * 1000;
  const isExpired = Date.now() > expiryTime - expiryBuffer;


  if (!isExpired) {
    return access_token;
  }

  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: refresh_token,
  });

  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const {
      access_token: newAccessToken,
      expires_in: newExpiresIn,
      refresh_token: new_refresh_token,
    } = response.data;

    await Zoho.findOneAndUpdate(
      { key: "zoho-global-token" },
      {
        access_token: newAccessToken,
        refresh_token: new_refresh_token || refresh_token,
        expires_in: newExpiresIn,
        last_updated: new Date(),
      }
    );
    

    return newAccessToken;
  } catch (error) {
    console.error(
      "Error refreshing Zoho access token:",
      error.response?.data || error.message
    );
  }
};
