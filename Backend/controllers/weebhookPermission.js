import axios from "axios";
import { grantIamAccess } from "../services/grantIamAccess.js";
import { buildIamCondition } from "../services/buildIamCondition.js";
import {
  createJiraWebhook,
  transitionChangeWithComment,
} from "../services/webhook.js";
import createError from "http-errors";
import { getIssueDetails } from "../services/jiraHelper.js";

export const handlePermission = async (req, res) => {
  try {
    const commentBody = req.body?.comment?.body;
    const issueKey = req.body?.issue?.key;
    const commentAuthorAccountId = req.body?.comment?.author?.accountId;

    // Fetch full issue details
    const issueDetails = await getIssueDetails(issueKey);
    if (!issueDetails) {
      return res.status(200).json({
        success: false,
        message: `Issue ${issueKey} not found or deleted. Ignoring webhook.`,
      });
    }

    const service = issueDetails.fields.customfield_10094;
    const resource = issueDetails.fields.customfield_10095;
    const access_duration = issueDetails.fields.customfield_10096;
    const role = issueDetails.fields.customfield_10092;
    const email = issueDetails.fields.customfield_10093;

    const authenticationCheck = await createJiraWebhook(
      commentBody,
      issueKey,
      commentAuthorAccountId
    );

    if (!authenticationCheck) {
      return res.status(200).json({
        success: false,
        message: "No approval/denied found. Ignoring comment.",
      });
    }

    if (authenticationCheck === "denied") {
      const transitionCloseAndComment = await transitionChangeWithComment(
        issueKey,
        "Done",
        "Your request has been denied."
      );

      return res.status(200).json({
        success: true,
        message: "Request denied by manager.",
      });
    }

    if (authenticationCheck === "approved") {
      const transitionToInProgressAndComment =
        await transitionChangeWithComment(
          issueKey,
          "In Progress",
          "Your request is now in progress."
        );

      const condition = buildIamCondition(
        access_duration,
        service,
        resource,
        role
      );
      await grantIamAccess(email, role, condition);
      console.log(`IAM access granted to ${email} with role ${role}`);

      const transitionToDoneAndComment = await transitionChangeWithComment(
        issueKey,
        "Done",
        "Access has been successfully granted."
      );
      return res
        .status(200)
        .json({ success: true, message: "Permission process completed." });
    }
  } catch (error) {
    console.log("Error occured in webhook Permission: ", error);
    throw createError(500, "Error occured in webhook Permission.", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        auth: error.config?.auth,
      },
    });
  }
};
