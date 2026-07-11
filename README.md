# DIGITECH SYSTEMS - E-Commerce Platform

Welcome to **DIGITECH SYSTEMS**, a complete, production-ready MERN stack e-commerce web application designed for a premium computer and electronics shop.

The platform is designed with a modern dark theme primary visual identity (`#0F172A`), rich micro-animations, full responsiveness, glassmorphic layout controls, and absolute database dynamism. All catalog products, pricing, categories, stock levels, and detail specifications sheets are managed directly from the built-in **Admin Dashboard**.

---

## 🛠️ Technology Stack

### Backend API
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Security**: JWT Authentication (Header Bearer Tokens) & bcryptjs Password Hashing
- **File Uploads**: Multer Middleware with local disk storage (falls back gracefully) or Cloudinary Cloud SDK

### Frontend Client
- **Build Engine**: Vite & React.js (ES Modules)
- **Router**: React Router DOM (v6)
- **State**: React Context API (Auth & Cart state persistency)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Icons**: React Icons (Lucide/Feather variants)
- **Animations**: Framer Motion
- **Carousel Slider**: SwiperJS
- **Alert Toast**: React Toastify

---

## 📦 Project Directory Structure

```text
Website/
├── backend/
│   ├── config/          # MongoDB connection & Cloudinary setup
│   ├── controllers/     # Users, Products, & Orders business controllers
│   ├── middleware/      # Authentication, Multer upload, & Error handlers
│   ├── models/          # Mongoose schemas (User, Product, Order)
│   ├── routes/          # Express API endpoint route definitions
│   ├── uploads/         # Local file directory for product image assets
│   ├── utils/           # Token signers & Database seeding utility
│   ├── .env             # Active runtime configurations
│   ├── package.json     # Node libraries dependencies
│   └── server.js        # Backend listener entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbars, footers, card widgets, & loading loaders
│   │   ├── context/     # AuthContext & CartContext states
│   │   ├── pages/       # Home, Catalog, Details, Cart, Checkout, Dashboard
│   │   ├── utils/       # Pre-configured Axios instance helper (api.js)
│   │   ├── App.jsx      # Route switches & page templates
│   │   ├── index.css    # PostCSS directives & glassmorphism variables
│   │   └── main.jsx     # Vite client entry bundle
│   ├── tailwind.config.js # Custom colors (#0F172A) & Poppins styling
│   └── package.json     # Frontend modules & compiler scripts
```

---

## 🔑 Environment Variables Configuration

Create a file named `.env` in the `backend/` folder. Use the following baseline template (which is preconfigured for local dev out-of-the-box):

```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/digitech
JWT_SECRET=digitech_systems_secret_key_123456
JWT_EXPIRE=30d

# Cloudinary Integration (Optional - falls back to local /uploads if empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## ⚙️ Quick Installation & Setup

Follow these steps to install and start the platform on your system:

### 1. Prerequisites
- Install **Node.js** (v18 or higher recommended).
- Install and start **MongoDB** locally (defaulting to port `27017`), or obtain a remote MongoDB Atlas URI.

### 2. Install Backend Dependencies
Open your shell, go to the `backend/` directory, and install the modules:
```bash
cd backend
npm install
```

### 3. Populate Database (Seed Inventory)
Run the seed utility script to drop any old database items and insert standard admin/customer credentials, alongside HP Laptops, Dell screens, Canon printers, and accessories:
```bash
npm run seed
```

> **Seeded Test Credentials:**
> - 🔑 **Administrator**: `admin@digitech.com` | Password: `admin123`
> - 🔑 **Customer Account**: `customer@digitech.com` | Password: `customer123`

### 4. Install Frontend Client Dependencies
Open a second terminal window, navigate to the `frontend/` folder, and install modules:
```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Platform

### Start Backend Service
Run this command inside the `backend/` directory to launch the server:
```bash
npm run dev
```
*The API gateway starts listening on **`http://localhost:5000`**.*

### Start Frontend Client
Run this command inside the `frontend/` directory to boot the Vite server:
```bash
npm run dev
```
*Vite serves the client site on **`http://localhost:3000`**.*
Open your web browser and navigate to `http://localhost:3000` to browse DIGITECH SYSTEMS!

---

## 🛡️ Inventory Management (Admin Guide)

No products are hardcoded on the client website. Normal visitors only see items present inside the MongoDB collection:
1. Log in using `admin@digitech.com` / `admin123`.
2. Click **Admin Dashboard** in the user profile navigation dropdown.
3. Click the **Products Inventory** tab.
4. Click **Create Product**:
   - **Name, Brand, & Description**: Standard inputs.
   - **Pricing & Discounts**: Enter original base price, and optional discount price (shows sales tags).
   - **Image Upload**: Select file(s) from your computer. If Cloudinary keys are supplied, files upload to the cloud. Otherwise, Multer stores them inside `backend/uploads/` statically.
   - **Dynamic Spec sheets**: Select a category. Pre-populated spec rows appear (Processor, RAM, Graphics). Add or delete custom rows dynamically.
   - **Visibility Controls**: Check "Hide Product from Customers" to instantly pull it from the customer listing without deleting it.

---

## 🌐 Production Deployment Guide

Follow these steps to host your DIGITECH SYSTEMS platform on live production cloud servers.

### 1. Database Setup: MongoDB Atlas
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project and build a Database Cluster (Shared M0 tier is free).
3. Under **Database Access**, create a user account and set a strong password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) since Render servers use dynamic IP allocations.
5. Click **Connect** -> **Drivers** -> Copy the connection URI string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/digitech?retryWrites=true&w=majority`

### 2. Media Uploads Setup: Cloudinary
To support dynamic image uploads from the Admin Panel in production:
1. Register for a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Console dashboard, copy the following credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. These variables must be set on your production backend server (Render).

### 3. Backend Deployment: Render
1. Create an account on [Render](https://render.com/).
2. Click **New +** -> Select **Web Service**.
3. Connect your GitHub repository (containing this codebase).
4. Configure the Web Service settings:
   - **Name**: `digitech-backend`
   - **Language**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** -> Add the following **Environment Variables**:
   - `MONGO_URI` = *(Your MongoDB Atlas URI copied in Step 1)*
   - `JWT_SECRET` = *(Any long secure random text string)*
   - `NODE_ENV` = `production`
   - `CLOUDINARY_CLOUD_NAME` = *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY` = *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET` = *(Your Cloudinary API Secret)*
6. Click **Create Web Service**. Once deployed, Render will provide a live API URL, e.g. `https://digitech-backend.onrender.com`.

### 4. Frontend Deployment: Vercel
1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://digitech-backend.onrender.com` *(Replace this with your actual Render API URL from Step 3)*
6. Click **Deploy**. Vercel will build your React application and provide a live URL, e.g. `https://digitech-systems.vercel.app`.
