import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

export const getIssueDetails = async (issueKey) => {
  try { 
    const response = await axios.get(
      `https://devanshpandit2004.atlassian.net/rest/api/3/issue/${issueKey}`,
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