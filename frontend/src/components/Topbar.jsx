import { FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <FaUserCircle className="text-3xl text-gray-700" />
    </div>
  );
};

export default Topbar;
