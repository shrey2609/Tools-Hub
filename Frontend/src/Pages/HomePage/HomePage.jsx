import { useEffect, useState } from "react";
import ToolCard from "../../Component/Toolcard/ToolCard";
import "./HomePage.css";

/**
 * HomePage Component
 * -------------------
 * This component fetches a list of engineering tools from the backend API
 * and displays them in a grid layout using the ToolCard component.
 */

function HomePage() {
  // State to store the list of tools fetched from API
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  
  /**
   * useEffect Hook
   * --------------
   * Runs once when the component mounts.
   * Fetches tools data from the backend API.
   */

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tools`)
      .then((res) => res.json())
      .then((data) => setTools(data))
      .catch((err) => console.error("Error fetching tools:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading tools...</h2>;
  }

  if (tools.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No tools available yet.</h2>;
  }

  return (
    <div className="homepage">
      <h1 className="homepage-title">Engineering Tools</h1>
      <div className="tools-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
