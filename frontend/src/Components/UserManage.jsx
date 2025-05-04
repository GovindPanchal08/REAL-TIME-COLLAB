import React, { useState } from "react";
import { SendData } from "../Const/api.js";
import { useNavigate } from "react-router-dom";
import { userData } from "../Context/context.jsx";
import { deleteCookie, getCookie } from "../Const/contant.js";
import { toast } from "react-toastify";

const UserManage = () => {
  const navigate = useNavigate();
  const roomid = localStorage.getItem("roomId");
  
  const { userName, email, pic } = userData();
  const [user, setUser] = useState({
    email: email,
    username: userName,
    profilePhoto: !pic ? "src/assets/public/images/profile.png" : pic, // Default profile photo
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    deleteCookie("token");
    window.location.href = "/";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    // Display the selected image in the UI
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prev) => ({
          ...prev,
          profilePhoto: reader.result, // Update the preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      if (selectedFile) {
        formData.append("photo", selectedFile);
        console.log(selectedFile);
      }

      const res = await SendData("/user/profile", formData);
      if (res.message === "Profile updated successfully.") {
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Profile update failed.");
      }
      console.log(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2d42] flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-300 to-indigo-600 opacity-30"></div>

      {/* Glassmorphism Main Section */}
      <div className="relative backdrop-blur-xl bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl shadow-xl  h-[90%] p-8 flex flex-col space-y-6 text-white">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(`/room/${roomid}`)}
            className="flex items-center text-gray-300 hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-start justify-center space-y-3">
          <div className="relative">
            <img
              src={
                user.profilePhoto
                  ? `data:image/jpeg;base64,${user.profilePhoto}`
                  : "/src/assets/public/images/profile.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-[3rem] object-cover object-top  border-4 border-gray-500 shadow-lg"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 16l7-7 7 7"
                />
              </svg>
            </label>
            <input
              type="file"
              id="profilePhoto"
              name="photo"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <h2 className="text-3xl font-semibold">
            {user.username || "Your Name"}
          </h2>
          <p className="text-lg text-gray-300">
            {user.email || "email@example.com"}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} action="">
          <div className="flex-grow gap-8">
            <div className="space-y-4 ">
              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className=" p-3 w-full rounded-lg bg-[#ffffff1a] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-none"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className=" p-3 w-full rounded-lg bg-[#ffffff1a] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex gap-10 justify-between items-center mt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
            >
              Logout
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManage;
