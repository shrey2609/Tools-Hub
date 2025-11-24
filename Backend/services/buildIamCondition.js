export const buildIamCondition = (access_duration, service, resource, role) => {

  const PROJECT_ID = process.env.PROJECT_ID;

   const primitiveRoles = ["roles/viewer", "roles/editor"];
  if (primitiveRoles.includes(role)) {
    return null;
  }


  const parts = [];

  // expiry condition
if (access_duration && String(access_duration).toLowerCase() !== "lifetime") {
    const days = parseInt(access_duration, 10);
    if (!isNaN(days)) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      parts.push(`request.time < timestamp("${expiryDate.toISOString()}")`);
    }
  }


  // Handle resource condition
  if (service === "GCP" && resource) {
    const resourceNames = resource
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => { 
        //Cloud Storage
      if (role.startsWith("roles/storage")) {
          return `resource.name.startsWith("projects/_/buckets/${name}")`;
        }
        //BigQuery
        // else if (role.startsWith("roles/bigquery")) {
        //   return `resource.name.startsWith("projects/${PROJECT_ID}/datasets/${name}")`;
        // } 
        //Pub/Sub (Topic or Subscription)
        if (role.startsWith("roles/pubsub")) {
          return `resource.name.startsWith("//pubsub.googleapis.com/projects/${PROJECT_ID}/topics/${name}") || resource.name.startsWith("//pubsub.googleapis.com/projects/${PROJECT_ID}/subscriptions/${name}")`;
        }
        //Compute Engine (VMs)
        if (role.startsWith("roles/compute") && !name.includes("forwardingRules")) {
          const zone = "us-central1-a";
          return `resource.name.startsWith("//compute.googleapis.com/projects/${PROJECT_ID}/zones/${zone}/instances/${name}")`;
        }
        //Load Balancer (Forwarding Rules)
        if (role.startsWith("roles/compute") && name.includes("forwardingRules")) {
          const region = "us-central1"; // adjust region if needed
          return `resource.name.startsWith("//compute.googleapis.com/projects/${PROJECT_ID}/regions/${region}/forwardingRules/${name}") || resource.name.startsWith("//compute.googleapis.com/projects/${PROJECT_ID}/global/forwardingRules/${name}")`;
        }
        //GKE (Google Kubernetes Engine)
        if (role.startsWith("roles/container")) {
          const location = "us-central1"; // adjust if needed
          return `resource.name.startsWith("//container.googleapis.com/projects/${PROJECT_ID}/locations/${location}/clusters/${name}")`;
        }

        //Default fallback
        return `resource.name.startsWith("${name}")`;
      });


      
    if (resourceNames.length > 0) {
      parts.push(`(${resourceNames.join(" || ")})`);
    }
  }

  if (parts.length === 0) return null;

  return {
    title: "ConditionalAccess",
    description: `Access condition with scope ${service}` + (access_duration !== "lifetime" ? " and expiry" : ""),
    expression: parts.join(" && "),
  };
};
