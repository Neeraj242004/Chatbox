import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const uploadAvatar = async (e) => {
    try {
      const formData = new FormData();

      formData.append(
        "avatar",
        e.target.files[0]
      );

      const res = await axios.post(
        `http://localhost:5000/api/user/avatar/${user.id}`,
        formData
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="h-[70px] bg-blue-600 shadow-lg px-5 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">💬</span>

        <h1 className="text-white text-xl font-bold">
          Chat Box
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${user?.username}`
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />

        {/* Username */}
        <span className="hidden sm:block text-white font-medium">
          {user?.username}
        </span>

        {/* Upload Avatar */}
        <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm">
          Upload

          <input
            type="file"
            className="hidden"
            onChange={uploadAvatar}
          />
        </label>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;