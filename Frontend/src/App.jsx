

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import HomePage from "./Pages/HomePage/HomePage";
import ToolDetails from "./Pages/ToolsDetails/ToolDetails";
import ChatbotWidget from "./Component/ChatbotWidget/ChatbotWidget";
import { ChatbotProvider } from "./Component/ChatbotWidget/ChatbotContext";
import ContactPage from "./Pages/ContactPage/ContactPage";
import ToolDetailsPage from "./Pages/ToolDetailsPage/ToolDetailsPage";
import AccessFrom from "./Pages/AccessFrom/AccessFrom";

function App() {
  return (
    <Router>
      <ChatbotProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools/:id" element={<ToolDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/tools/:id" element={<ToolDetailsPage />} />
          <Route path="/access" element={<AccessFrom />} />
        </Routes>

        {/* Chatbot is always available, floating in UI */}
        <ChatbotWidget />
      </ChatbotProvider>
    </Router>
  );
}

export default App;
