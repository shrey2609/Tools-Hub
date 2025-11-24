import React, { useEffect, useState } from "react";
import "./AccessForm.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


const BASIC_ROLES = [
  { value: "roles/viewer", label: "Viewer" },
  { value: "roles/editor", label: "Editor" },
];

const AccessFrom = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);

  const [roleSearch, setRoleSearch] = useState("");
  const [categorizedRoles, setCategorizedRoles] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    service: "",
    role: "",
    access_duration: "",
    resource: "",
  });


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/access/gcp/roles"
        );
        setRoles(res.data);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const categorizeRoles = (roles) => {
    const grouped = {};
    roles.forEach((role) => {
      const parts = role.name.split("/");
      const category = parts[1]?.split(".")[0] || "Other";

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        value: role.name,
        label: role.title || role.name || roleName,
      });
    });
    grouped["Basic"] = BASIC_ROLES;
    return grouped;
  };

  useEffect(() => {
    if (roles.length > 0) {
      const grouped = categorizeRoles(roles);

      const ordered = {
        Basic: grouped["Basic"],
        ...Object.fromEntries(
          Object.entries(grouped).filter(([key]) => key !== "Basic")
        ),
      };

      setCategorizedRoles(ordered);
      setSelectedCategory("Basic");
    }
  }, [roles]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      role: selected ? selected.value : "",
    }));

    const role =
      roles.find((r) => r.name === selected?.value) ||
      BASIC_ROLES.find((r) => r.value === selected?.value);
    setSelectedRoleDetails(role || null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Submitting request...");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/access/ask-permission",
        formData
      );
      console.log("Backend response:", res.data);
      toast.dismiss(toastId);
      toast.success(
        <>
          Request created successfully.Ticket ID:
          <a
            href={res.data.jiraTask.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0d6efd",
              textDecoration: "underline",
              marginLeft: "8px",
            }}
          >
            ${res.data.ticketId}
          </a>
        </>
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.dismiss(toastId);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="af-page">
      <Toaster />
      <div className="af-card" role="region" aria-label="Access Request Form">
        <header className="af-header">
          <h1 className="af-title">Access Request Form</h1>
          <p className="af-sub">Fill details to request access</p>
        </header>

        <form className="af-form" onSubmit={handleSubmit}>
          <div className="af-row">
            <label htmlFor="email">User Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="af-row">
            <label htmlFor="service">Requested Service</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Service --</option>
              <option value="GCP">GCP</option>
            </select>
          </div>

          <div className="af-row">
            <label>Requesting Role</label>

            {/* Agar service select nahi hai */}
            {!formData.service ? (
              <div className="role-input disabled">
                <span className="placeholder">-- Select Role --</span>
              </div>
            ) : formData.service === "GCP" ? (
              <div className="role-picker">
                {/* Role input field */}
                <div
                  className="role-input"
                  onClick={() => {
                    if (!formData.role) setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  {formData.role ? (
                    <div className="role-selected">
                      <span>{formData.role}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleChange({ value: "", label: "" });
                          setIsDropdownOpen(true);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="placeholder">Select a role...</span>
                  )}
                </div>

                {/* Dropdown only if no role selected */}
                {isDropdownOpen && !formData.role && (
                  <div className="role-dropdown">
                    <input
                      type="text"
                      placeholder="Filter by role or permission..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="role-search"
                    />

                    <div className="dropdown-panels">
                      {/* Categories */}
                      <div className="categories">
                        {Object.keys(categorizedRoles)
                          .filter((cat) => {
                            if (!roleSearch) return true;
                            return (
                              cat
                                .toLowerCase()
                                .includes(roleSearch.toLowerCase()) ||
                              categorizedRoles[cat].some((r) =>
                                r.label
                                  .toLowerCase()
                                  .includes(roleSearch.toLowerCase())
                              )
                            );
                          })
                          .map((cat) => (
                            <div
                              key={cat}
                              className={`category ${
                                selectedCategory === cat ? "active" : ""
                              }`}
                              onClick={() => setSelectedCategory(cat)}
                            >
                              {cat}
                            </div>
                          ))}
                      </div>

                      {/* Subroles */}
                      <div className="sub-roles">
                        {selectedCategory &&
                          categorizedRoles[selectedCategory]
                            .filter((r) =>
                              r.label
                                .toLowerCase()
                                .includes(roleSearch.toLowerCase())
                            )
                            .map((role) => (
                              <div
                                key={role.value}
                                className="sub-role"
                                onClick={() => {
                                  handleRoleChange(role);
                                  setIsDropdownOpen(false);
                                  setSelectedCategory("");
                                }}
                              >
                                {role.label}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="af-row">
            <label htmlFor="access">Date of Access Required</label>
            <select
              id="access_duration"
              name="access_duration"
              value={formData.access_duration}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Duration --</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          {/* <div className="af-row">
            <label htmlFor="service">Resource Tag</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Resource Type --</option>
              <option value="Storage">Storage</option>
            </select>
          </div> */}

          <div className="af-row">
            <label htmlFor="resource">Resource Name (Optional)</label>
            <input
              id="resource"
              name="resource"
              type="text"
              placeholder="bucket1, bucket2, ..."
              value={formData.resource}
              onChange={handleChange}
            />
          </div>

          <button className="af-submit" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccessFrom;
