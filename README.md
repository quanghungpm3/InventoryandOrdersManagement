🚀 Local Setup Instructions
1. Clone the Repository
git clone https://github.com/quanghungpm3/InventoryandOrdersManagement.git
cd your-project

2. Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3. Run the Application
Start Backend Server
cd backend
npm start

Start Frontend Application
cd ../frontend
npm run dev

Backend will run on: http://localhost:5001 (or configured port)
Frontend will run on: http://localhost:5173 (Vite default)

4. Test Account

You can use the following test account to explore the system:

Username: longla
Password: longla

👉 You can also create a new account by clicking the Register button on the login page.

✅ Requirements

Node.js v18 or higher
npm v9 or higher

🔐 Environment Variables Setup

This project uses environment variables for configuration.

1. Create .env Files

Each part of the project contains a .env.example file.
You must create a .env file based on it.

Backend
cd backend
cp .env.example .env

Frontend
cd frontend
cp .env.example .env

2. Configure Environment Variables

Open the newly created .env file and update the values if needed.

Example:

Backend .env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Frontend .env
VITE_API_URL=http://localhost:5001/api


⚠️ Important Notes

Do NOT commit .env files to GitHub

.env.example is used only as a template

Restart the server after changing environment variables

📌 Quick Start (Summary)
git clone https://github.com/quanghungpm3/InventoryandOrdersManagement.git
cd your-project

cd backend
npm install
cp .env.example .env
npm start

cd ../frontend
npm install
cp .env.example .env
npm run dev
