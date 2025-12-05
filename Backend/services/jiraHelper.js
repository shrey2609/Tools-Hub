import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


 const { JIRA_EMAIL, JIRA_API_TOKEN, JIRA_BASE_URL } = process.env;


export const getIssueDetails = async (issueKey) => {
  try { 
    const response = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
      {
        auth: {
          username:JIRA_EMAIL,
          password:JIRA_API_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
     if (error.response?.status === 404) {
      console.warn(`Issue ${issueKey} not found (deleted or no permission).`);
      return null;
    }
    throw error;
  }
}