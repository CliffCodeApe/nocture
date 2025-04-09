import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import './style.css';
import SplashScreen from "./components/splash-screen/SplashScreen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SplashScreen />
  </StrictMode>
);