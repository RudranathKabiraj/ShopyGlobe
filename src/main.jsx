import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import axios from "axios";

// 🔧 Axios Global Config
axios.defaults.baseURL = "http://localhost:5000"; // change if deployed
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/ShopyGlobe">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
