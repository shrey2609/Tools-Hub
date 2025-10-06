import axios from "axios";
import createError from "http-errors";

export const createJiraWebhook = async (
  commentBody,
  issueKey,
  commentAuthorAccountId
) => {
  const { JIRA_API_TOKEN, JIRA_EMAIL } = process.env;

  if (!commentBody || !issueKey || !commentAuthorAccountId) {
    throw createError(400, "Required fields missing");
  }

  const comment = commentBody.toLowerCase();

  try {
    //Fetch issue details to get reporter accountId
    const issueDetails = await axios.get(
      `https://devanshpandit2004.atlassian.net/rest/api/3/issue/${issueKey}`,
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const reporterAccountId = issueDetails.data.fields.reporter.accountId;

    if (reporterAccountId !== commentAuthorAccountId) {
      console.log("Comment not made by the reporter. Ignoring approval.");
      throw new Error("Only the manager (reporter) can approve this request.");
    }
    if (comment.includes("approved")) {
      console.log("Manager approved");
      return "approved";
    } else if (comment.includes("denied")) {
      console.log("Manager denied");
      return "denied";
    }
  } catch (error) {
    console.log("error during checking rights:", error);
    return false;
  }
};

export const transitionChangeWithComment = async (
  issueKey,
  transitionName,
  commentText
) => {
  const { JIRA_API_TOKEN, JIRA_EMAIL } = process.env;
  try {
    //Fetch available transitions
    const transitionsResponse = await axios.get(
      `https://devanshpandit2004.atlassian.net/rest/api/3/issue/${issueKey}/transitions`,
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    const transitions = transitionsResponse.data.transitions;

    //Find the correct transition (e.g., "Start progress")
    const targetTransition = transitions.find(
      (t) => t.name.toLowerCase().trim() === transitionName.toLowerCase().trim()
    );

    if (!targetTransition) {
      throw new Error(`Transition '${transitionName}' not available.`);
    }

    //Perform the transition
    await axios.post(
      `https://devanshpandit2004.atlassian.net/rest/api/3/issue/${issueKey}/transitions`,
      {
        transition: { id: targetTransition.id },
      },
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    //Add a comment to the issue
    await axios.post(
      `https://devanshpandit2004.atlassian.net/rest/api/3/issue/${issueKey}/comment`,
      {
        body: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: commentText,
                },
              ],
            },
          ],
        },
      },
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error while changing transition:", error.response);
  }
};
