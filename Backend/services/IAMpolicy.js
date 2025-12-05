import { GoogleAuth } from "google-auth-library";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID; 
const SECRET_ID = process.env.SA_SECRET_NAME;  
const SECRET_VERSION = "latest";

const SECRET_NAME = `projects/${PROJECT_ID}/secrets/${SECRET_ID}/versions/${SECRET_VERSION}`;

const client = new SecretManagerServiceClient();

let auth;

async function readSecret() {
  try {
    const [response] = await client.accessSecretVersion({ name: SECRET_NAME });
    const serviceAccountJSON = response.payload.data.toString("utf8");
    const credentials = JSON.parse(serviceAccountJSON);

      auth = new GoogleAuth({
      credentials, 
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  
} catch (error) {
    console.error("Secret Manager Error:", error);
  }
}
 await readSecret();



export const getAccessToken = async () => {
  const googleClient = await auth.getClient();
  const token = await googleClient.getAccessToken();
  return token.token;
}


export const getIamPolicy = async () => {
  const token = await getAccessToken();
  const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${PROJECT_ID}:getIamPolicy`;

  const res = await axios.post(
    url,
    { options: { requestedPolicyVersion: 3 } },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};


export const setIamPolicy = async (newBindings, etag) => {
  const token = await getAccessToken();

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

let rolesCache = null;
let rolesCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export const getIamRoles = async () => { 
  const now = Date.now();

  if (rolesCache && now - rolesCacheTime < CACHE_TTL) {
  return rolesCache;
  }

  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  

  const fetchAllRoles = async (baseUrl) => { 
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

  rolesCache = allRoles;
  rolesCacheTime = now;


  return allRoles;
}

  
  