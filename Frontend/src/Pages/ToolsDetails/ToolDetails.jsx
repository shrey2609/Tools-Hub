import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ToolDetails.css";

/**
 * ToolDetails Component
 * ----------------------
 * This component displays detailed information about a single tool.
 * It fetches the tool details from the backend using the tool ID
 * obtained from the URL params.
 */

function ToolDetails() {
  // Extract `id` from the URL (React Router)
  const { id } = useParams();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBaseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  /**
   * useEffect Hook
   * ---------------
   * Fetch tool details whenever the `id` changes.
   */
  useEffect(() => {
    fetch(`${backendBaseURL}/api/tools/${id}`)
      .then((res) => res.json()) // Parse response as JSON
      .then((data) => {
        setTool(data); // Save tool data in state
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tool:", err);
        setLoading(false);
      });
  }, [id, backendBaseURL]);

  if (loading) {
    return <div className="tool-details">Loading...</div>;
  }

  if (!tool) {
    return (
      <div className="tool-details">
        <h2>Tool Not Found </h2>
        <p>The signup guide for this tool is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="tool-details">
      <h1 className="tool-title">{tool.name}</h1>

      <p>
        <b>Category:</b> {tool.category}
      </p>
      <p>
        <b>Description:</b> {tool.description}
      </p>

      {/* 📄 Company Document or fallback message */}
      {tool.companyDocument && tool.companyDocument.trim() !== "" ? (
        <a
          href={tool.companyDocument}
          target="_blank"
          rel="noreferrer"
          className="tool-btn doc-btn"
        >
          📄 View Company Document
        </a>
      ) : (
        <p className="doc-message">
          🚧 The company document is being prepared and will be uploaded soon.
          Stay tuned!
        </p>
      )}

      {/* 🔗 Official site */}
      <a
        href={tool.officialLink}
        target="_blank"
        rel="noreferrer"
        className="tool-btn link-btn"
      >
        🔗 Visit Official Site
      </a>

      <div className="signup-guide">
        <h3>Signup Guide</h3>
        <section>
          <h4>About</h4>
          <p>{tool.guide?.about || "No details available yet."}</p>
        </section>
        <section>
          <h4>How to Sign Up</h4>
          <p>{tool.guide?.signup || "No details available yet."}</p>
        </section>
        <section>
          <h4>How to Login</h4>
          <p>{tool.guide?.login || "No details available yet."}</p>
        </section>
        <section>
          <h4>How to Use</h4>
          <p>{tool.guide?.usage || "No details available yet."}</p>
        </section>
      </div>
    </div>
  );
}

export default ToolDetails;
