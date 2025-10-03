import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ToolDetailsPage.css";

function ToolDetailsPage() {
  const { id } = useParams();

  // state to store tool data fetched from backend
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch tool from backend using its id
  useEffect(() => {
    fetch(`http://localhost:5000/api/tools/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTool(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tool:", err);
        setLoading(false);
      });
  }, [id]);

  // loading indicator
  if (loading) {
    return <div className="tool-details">Loading...</div>;
  }

  // show message if tool not found in backend
  if (!tool) {
    return (
      <div className="tool-details">
        <h2>Tool Not Found</h2>
        <p>The signup guide for this tool is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="tool-details">
      <h2>{tool.name}</h2>

      <section>
        <h3>About</h3>
        <p>{tool.guide?.about}</p>
      </section>

      <section>
        <h3>How to Sign Up</h3>
        <p>{tool.guide?.signup}</p>
      </section>

      <section>
        <h3>How to Login</h3>
        <p>{tool.guide?.login}</p>
      </section>

      <section>
        <h3>How to Use</h3>
        <p>{tool.guide?.usage}</p>
      </section>
    </div>
  );
}

export default ToolDetailsPage;
