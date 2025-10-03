import { Link } from "react-router-dom";
import "./ToolCard.css";

function ToolCard({ tool }) {
  return (
    <div className="tool-card">
      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-category">{tool.category}</p>
      <p className="tool-card-description">{tool.description}</p>

      <div className="tool-card-buttons">
        <a
          href={tool.officialLink}
          target="_blank"
          rel="noreferrer"
          className="tool-btn official"
        >
          Official Link
        </a>

        <Link to={`/tools/${tool.id}`} className="tool-btn signup">
          Signup Guide
        </Link>
      </div>
    </div>
  );
}

export default ToolCard;
