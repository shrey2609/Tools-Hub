import { GoogleAuth } from "google-auth-library";
import axios from "axios";
import path from "path";  



const PROJECT_ID = "logical-codex-472311-i2";

const auth = new GoogleAuth({
  // keyFile: "./service-account.json",
  keyFile: path.join(process.cwd(), "./service-account.json"), 
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

async function getAccessToken() {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}


export async function getIamPolicy() {
  const token = await getAccessToken();
  const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${PROJECT_ID}:getIamPolicy`;

  const res = await axios.post(
    url,
    {
      options: {
        requestedPolicyVersion: 3,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

export async function setIamPolicy(newBindings, etag) {
  const token = await getAccessToken();
  const currentPolicy = await getIamPolicy();

  const updatedPolicy = {
      policy: {
      version: 3, 
      bindings: newBindings,
      etag,
    },
  };

  const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${PROJECT_ID}:setIamPolicy`;

  const res = await axios.post(url, updatedPolicy, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}


export async function getIamRoles() {
  const token = await getAccessToken();
   const headers = { Authorization: `Bearer ${token}` };
  

async function fetchAllRoles(baseUrl) {
   let roles = [];
    let nextPageToken = null;

    do {
      const url = nextPageToken
        ? `${baseUrl}&pageToken=${nextPageToken}`
        : baseUrl; 


     const res = await axios.get(url, { headers });
      roles = roles.concat(res.data.roles || []);
      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);

    return roles;
  }


  const predefinedRoles = await fetchAllRoles(
    `https://iam.googleapis.com/v1/roles?view=FULL&pageSize=300`
  );


  const projectRoles = await fetchAllRoles(
    `https://iam.googleapis.com/v1/projects/${PROJECT_ID}/roles?view=FULL&pageSize=300`
  );

  const allRoles = [...predefinedRoles, ...projectRoles];


  console.log("Total Roles Fetched:", allRoles.length);
  allRoles.slice(0, 10).forEach((role, i) => {
  });

  return allRoles;
}

  
  