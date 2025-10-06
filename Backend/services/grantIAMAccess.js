import { getIamPolicy, setIamPolicy } from "./IAMpolicy.js";

export const grantIamAccess = async (email, role, condition = null) => {
  try {
    const policy = await getIamPolicy({ requestedPolicyVersion: 3 });
    const bindings = policy.bindings || [];
    const etag = policy.etag;


    const primitiveRoles = ["roles/viewer", "roles/editor", "roles/owner"];

    let finalRole = role.startsWith("roles/") ? role : `roles/${role}`;

    
    const newBinding = {
      role: finalRole,
      members: [`user:${email}`],
      ...(condition && !primitiveRoles.includes(finalRole) ? { condition } : {}),
    };

    bindings.push(newBinding);


    const uniqueBindings = [];
    const seen = new Set();

    for (const b of bindings) {
      const members = Array.isArray(b.members) ? b.members : [];
       const conditionKey = b.condition ? JSON.stringify(b.condition) : "";
      const key = `${b.role}:${members.sort().join(",")}:${conditionKey}`;
      if (!seen.has(key)) {
        uniqueBindings.push({
          role: b.role,
          members,
          ...(b.condition ? { condition: b.condition } : {})
        });
        seen.add(key);
      }
    }

    const newPolicy = {
      version: 3,
      bindings: uniqueBindings,
      etag,
    };

    const result = await setIamPolicy(uniqueBindings, etag);
    console.log("IAM Policy updated:", result);

  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};
