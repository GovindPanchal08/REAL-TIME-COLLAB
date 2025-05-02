import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SendData } from "../../../Const/api.js";
const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password } = formData;
      const res = await SendData("/user/login", {
        email,
        password,
      });
      // console.log(res);
      if (res.message === "Successfully Login" && res.data.token) {
        toast.success(res.message);
        window.localStorage.setItem("userId", res.data.user);
        localStorage.setItem("token", res.data.token);
        onSuccess(res.data.token);
        navigate("/");
      } else if (res.error === "email or password incorrect") {
        toast.warning("try agian");
      } else if (res.error === "password did not match") {
        toast.warning("invalid credentials");
      } else {
        toast.error(res.message);
        navigate("/ragister");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 text-black bg-white
       rounded-2xl shadow-md overflow-hidden"
      >
        {/* Left Section - Branding */}
        <div className="w-full  lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br mb-20 ">
          <div className="mb-6">
            <h1
              onClick={() => navigate("/")}
              className="text-4xl font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Code<span className="text-blue-500">ify</span>
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Welcome Back!</h2>
            <p className="">
              Continue your coding journey with Codeify and collaborate with
              peers.
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-blue-200">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h3>
            <p className="text-gray-500">
              Please login to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="email"
                value={formData.email}
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex justify-between items-center ">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                value={formData.password}
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />
            </div>

            <button
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              type="submit"
            >
              Sign In
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/ragister")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
