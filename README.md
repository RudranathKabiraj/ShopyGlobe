# ShoppyGlobe - E-commerce Application  

ShoppyGlobe is a simple e-commerce web application built using **React**, **Redux**, and **Tailwind CSS**. It allows users to browse products, view product details, search through items, and manage a shopping cart.  

---

## Features  
- Product listing fetched from a public API.  
- Real-time product search with Redux.  
- Product detail page with dynamic routing.  
- Add to Cart and Remove from Cart functionality.  
- Cart total calculation and item quantity handling.  
- Lazy loading for performance optimization.  
- Responsive UI using Tailwind CSS.  
- Custom 404 page for undefined routes.  
- Routing using React Router.  

---

## Technologies Used  
**Frontend:** React (Vite), Redux Toolkit, React Router v6, Tailwind CSS, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, dotenv  

---

## Installation & Setup  

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/shoppyglobe.git
cd shoppyglobe
```

---

### **2. Setup Backend**
```bash
cd backend
npm install
```
- Create a `.env` file inside the `backend` folder with:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
- Start the backend server:  
```bash
npm start
```
**Expected output:**
```
> shoppyglobe-backend@1.0.0 start
> node server.js

[dotenv@17.2.0] injecting env (3) from .env
Server running on port 5000
MongoDB connected
```

---

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Notes  
- The backend must be running for full functionality.  
- Without backend connection, the app will fetch only public API data.  
- **Do not commit `.env`** files to GitHub for security.  
