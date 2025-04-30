import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return (
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  );
};

export default Toast;
