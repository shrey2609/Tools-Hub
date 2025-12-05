import { createJiraTask } from "../services/jiraTask.js";
import { getReportingManagerEmail } from "../services/zoho.js";
import  createError from "http-errors";

// handle ask permission request from iternal wiki.
export const askPermission = async (req, res) => {
  try {
    const { email, role, service, access_duration, resource } = req.body;    

    if (!email || !service || !access_duration || !role ) {
      throw createError(400, "Required fields missing");
    }

    //fetch the reporting manager from zoho.
    const managerEmail = await getReportingManagerEmail(email);

    
    //create jira task for requesting user.
    const jiraTask = await createJiraTask(email, role, service, access_duration, resource, managerEmail);

 
    res.status(200).json({
      success: true,
      message: "Request is under process. Will notify you once approved or declined.",
      ticketId: jiraTask.jiraIssue.key,   
      jiraTask: jiraTask.jiraIssue,       
    });
  } catch (error) {
     return res.status(500).json({success:false, error:error})
  }
};
