import axios from "axios";

export const createJiraTask = async (
  email,
  role,
  service,
  access_duration,
  resource,
  managerEmail
) => {
  try {
    const { JIRA_EMAIL, JIRA_API_TOKEN, JIRA_BASE_URL } = process.env;

    if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
      throw new Error("Missing Jira credentials in environment variables.");
    }

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
      "base64"
    );
    //Get Jira Account ID using email
    const managerSearch = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/user/search?query=${managerEmail}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    const userSearch = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/user/search?query=${email}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    const userAccountId = userSearch.data[0]?.accountId;
    if (!userAccountId) throw new Error("Jira accountId not found for user");

    const managerAccountId = managerSearch.data[0]?.accountId;
    if (!managerAccountId)
      throw new Error("Jira accountId not found for manager");


    const payload = {
      fields: {
        project: { key: "ARP" },
        summary: `Access Request: ${service} from ${email}.`,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
          type: "paragraph",
          content: [
            { 
              type: "text", 
              text: `This user:${email} is requesting access for service: ${service} for the role: ${role}. Please Comment Approved if you wants to give Access, otherwise Denied.` 
            }
          ],
        },
            {
              type: "paragraph",
              content: [{ type: "text", text: `User Email: ${email}` }],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Requested Service: ${service}` },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Requested Service Role: ${role}` },
              ],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: `Access Duration: ${access_duration} days` }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: `Resource(s): ${resource}` }],
            },
          ],
        },
        issuetype: { name: "Task" },
        assignee: { accountId: userAccountId },
        reporter: { accountId: managerAccountId },
        // priority: { name: "High" },
        // labels: ["api-created", "zoho"],

    
        customfield_10820: email,         
        customfield_10819: service,    
        customfield_10821: role,        
        customfield_10818: access_duration === "lifetime" ? null : Number(access_duration),    
        customfield_10817: resource,    
      },
    };

    const issueRes = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      payload,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 20000, 
      }
    );
    console.log("Task created successfully:", issueRes.data);

    return {
      jiraIssue: {
        id: issueRes.data.id,
        key: issueRes.data.key,
        url: `${JIRA_BASE_URL}/browse/${issueRes.data.key}`, 
      },
    };
  } catch (error) {
    console.error(
      "Error in Jira task creation:",
      error.response?.data || error.message
    );
    throw new Error("Error in Jira task creation.");
  }
};
