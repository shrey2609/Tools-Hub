# Tools-Hub
This project is a centralized engineering tools hub with an integrated chatbot powered by RAG (Retrieval-Augmented Generation)


# **Engineering Tools Wiki**

A full-stack web application that provides an **engineering tools dashboard** with detailed guides, search, and chatbot assistance.
Built using **React.js** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## **Frontend Features**

* **Home Page:** Displays a list of engineering tools in a card layout.
* **Tool Details:** View detailed information about each tool, including category, description, official link, and signup/login/usage guides.
* **Responsive Design:** Works seamlessly on desktop and mobile.
* **Contact Page:** Shows company contact information with clickable email, phone, and address links.
* **Navbar:** Stays fixed at the top while scrolling.
* **Chatbot Widget:** Interactive demo chatbot that scrolls automatically to latest messages and supports sending messages via the Enter key.

---

## **Backend Features**

* **Node.js + Express API:** Serves tool data from MongoDB.
* **MongoDB Database:** Stores tools with details and guides.
* **Seed & Sync Scripts:**

  * `seedTools.js` — Adds default tools to the database.
  * `syncTools.js` — Updates existing tools with latest default data.
* **Upsert Support:** Any changes in `defaultTools.js` can be synced with the database.

--------------------------------------------------------------------------------------------------------------------------------------------

## **Frontend File Structure**

```
TASK
├── Frontend
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── Component
│   │   │   ├── ChatbotWidget
│   │   │   ├── Navbar
│   │   │   └── Toolcard
│   │   ├── Data
│   │   ├── Pages
│   │   │   ├── ContactPage
│   │   │   ├── HomePage
│   │   │   ├── ToolDetailsPage
│   │   │   └── ToolsDetails
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
└── README.md
```

---

## **Backend File Structure**

```
TASK
├── Backend
│   ├── chatbot
│   ├── controllers
│   ├── models
│   ├── node_modules
│   ├── Public
│   ├── routes
│   ├── seed
│   │   ├── defaultTools.js
│   │   ├── seed.js
│   │   └── syncTools.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── Server.js
└── Frontend
```

-------------------------------------------------------------------------------------------------------------------------------------------

## **Installation & Setup**

### **Backend**

1. Clone the repository:

```bash
git clone <repo-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your MongoDB URI:

```env
MONGO_URI=your_mongo_connection_string
PORT=5000
```

### **Sync Default Tools**

If you update `defaultTools.js`, run the sync script to reflect changes in the database:

```bash
# Navigate to backend
cd backend

# Run sync
node seed/syncTools.js

# Start the server
npm run dev
# or
node Server.js

# After running these commands, all default tools from defaultTools.js will be available in the connected MongoDB.
```


### **Frontend**

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend server:

```bash
npm run dev
```

------------------------------------------------------------------------------------------------------------------------------------------

## **Adding in new DB or Updating Tools**

1. Add or update tool information in `backend/seed/defaultTools.js`:

```js
{
  id: "newtool",
  name: "New Tool",
  category: "Category",
  description: "Tool description",
  officialLink: "https://example.com",
  guide: {
    about: "",
    signup: "",
    login: "",
    usage: ""
  }
}
```

2. Run the sync script:

```bash
node seed/syncTools.js
```

3. Changes will reflect automatically in the frontend.

---

-

