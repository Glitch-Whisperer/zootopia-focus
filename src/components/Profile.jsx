import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("metrofocus-user"));

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("metrofocus-user");
    localStorage.removeItem("metrofocus-region");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-[360px]">
        <h1 className="text-xl font-bold mb-4">Profile</h1>

        <p className="text-white/60 text-sm">Name</p>
        <p className="mb-3">{user.name}</p>

        <p className="text-white/60 text-sm">Email</p>
        <p className="mb-6">{user.email}</p>

        <p className="text-white/60 text-sm text-center">XP Earned</p>
        <p className="text-3xl font-bold text-emerald-400 text-center mb-6">
          {user.xp ?? 0}
        </p>

        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
