import axios from "axios";
import qs from "qs";


let cachedToken = null;
let tokenExpiry = 0;


export const getAccessToken = async () => {

  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
  });

  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

  cachedToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;    

  return cachedToken;
  } catch (error) {
    console.error(
      "Error refreshing Zoho access token:",
      error.response?.data || error.message
    );
  }
};
