export const buildIamCondition = (access_duration, service, resource, role) => {

  const PROJECT_ID = "logical-codex-472311-i2";

   const primitiveRoles = ["roles/viewer", "roles/editor"];
  if (primitiveRoles.includes(role)) {
    return null;
  }


  const parts = [];

if (access_duration && String(access_duration).toLowerCase() !== "lifetime") {
    const days = parseInt(access_duration, 10);
    if (!isNaN(days)) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      parts.push(`request.time < timestamp("${expiryDate.toISOString()}")`);
    }
  }


  if (service === "GCP" && resource) {
    const resourceNames = resource
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => { 
      if (role.startsWith("roles/storage")) {
          return `resource.name.startsWith("projects/_/buckets/${name}")`;
        } else if (role.startsWith("roles/bigquery")) {
          return `resource.name.startsWith("projects/${PROJECT_ID}/datasets/${name}")`;
        } 
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
