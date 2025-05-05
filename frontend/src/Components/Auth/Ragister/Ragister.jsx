import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SendData } from "../../../Const/api";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
      const { username, email, password } = formData;
      if (password.length !== 4) {
        toast.info("password must be 4 char-long");
        return;
      }
      const res = await SendData(
        "/user/ragister", // Corrected the typo from "ragister" to "register"
        {
          username,
          email,
          password,
        }
      );
      if (res.error === "Account already exists") {
        toast.info(res.error);
        navigate("/login");
      } else if (res.message === "User created successfully") {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen   flex items-center  justify-center bg-gray-50">
      <div
        className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 text-black bg-white
       rounded-2xl shadow-md overflow-hidden"
      >
        {" "}
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
            <h2 className="text-2xl font-semibold">Welcome!</h2>
            <p className="">
              Make coding journey with Codeify and collaborate with peers.
            </p>
          </div>
        </div>
        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 bg-blue-200">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h3>
            <p className="text-gray-500">Create account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                UserName
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                value={formData.username}
                name="username"
                placeholder="John Doe"
                required
                onChange={handleChange}
              />
            </div>
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
              Sign Up
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
