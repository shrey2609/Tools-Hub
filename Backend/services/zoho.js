import axios from "axios";
import qs from "qs";
import { getAccessToken } from "../seed/zohohelper.js";
import dotenv from "dotenv";

dotenv.config();

const ZOHO_BASE_URL = process.env.ZOHO_BASE_URL;


// fetches the employee reporting manager from zoho
export const getReportingManagerEmail = async(email) => {
  try {
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
        throw new Error("employee with this email does not exist")
      }
  
      const employee = employeeData[0];
      if (!employee["Reporting To"]) {
        throw new Error("Employee with this email does not exist");
      }

      const reportingManagerDetails = employee["Reporting To"];
      if (!reportingManagerDetails) {
        throw new Error("Reporting manager not assigned for this employee")
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
        throw new Error("Reporting manager record not found")
      }
      const manager = managerData[0];
      const reportingManagerEmail = manager["Email ID"];
  
      if (!reportingManagerEmail) {
        throw new Error("Reporting Manager email not found")
      }
   
      return reportingManagerEmail;

} catch (error) {
    console.error("Zoho error:",  error.message);
    throw new Error(error.message);
  }
};