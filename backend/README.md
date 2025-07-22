# 🛒 ShoppyGlobe - Full Stack E-commerce App

ShoppyGlobe is a simple online shopping app built using **React + Redux** for the frontend and **Node.js + Express + MongoDB** for the backend. You can browse products, log in, add items to your cart, and manage everything through APIs.

---

## 🧰 Tech Used

- **Frontend:** React, Redux Toolkit, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Testing:** Thunder Client (VS Code)
- **Database:** MongoDB (Local or Atlas)

---

## 🚀 How to Run the Project

### 1️⃣ Clone & Install

git clone https://github.com/your-username/shoppyglobe.git
cd shopyglobe
```

### 2️⃣ Install Packages

**Backend**
cd backend
npm install
```

**Frontend**

cd ../frontend
npm install
```

---

### 3️⃣ Setup `.env` in `backend` folder

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shoppyglobe
JWT_SECRET=yourSecretKey
```

✅ Make sure MongoDB is running locally (`mongod` command)

---

### 4️⃣ Start Servers

**Backend**
```bash
cd backend
npm start
```

**Frontend**
```bash
cd frontend
npm run dev
```

---

## 🧪 Thunder Client API Testing

Open Thunder Client (VS Code Extension) and use these APIs:

### ➕ Register

```
POST http://localhost:5000/api/auth/register

{
  "name": "Rudra",
  "email": "rudra@example.com",
  "password": "123456"
}
```

### 🔐 Login

```
POST http://localhost:5000/api/auth/login

{
  "email": "rudra@example.com",
  "password": "123456"
}
```

📌 Copy the returned token for the next steps

---

### 🛒 Cart APIs (Need Token in Header)

- Add to Cart:
  ```
  POST /api/cart
  Headers: Authorization: Bearer <token>
  
  {
    "productId": "<id>",
    "quantity": 1
  }
  ```

- Get Cart:
  ```
  GET /api/cart
  Headers: Authorization: Bearer <token>
  ```

- Update Cart:
  ```
  PUT /api/cart/:id
  Headers: Authorization: Bearer <token>

  {
    "quantity": 2
  }
  ```

- Delete from Cart:
  ```
  DELETE /api/cart/:id
  Headers: Authorization: Bearer <token>
  ```

---

## ✅ Final Tips

- Insert some product data in MongoDB before using cart APIs
- Always include the Bearer token for protected routes
- If you get `Route not found`, check spelling or method (POST/GET)

---

🎉 That’s it!
