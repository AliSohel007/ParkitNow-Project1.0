import { useEffect, useState } from "react";
import socket from "../utils/socket"; // path check kar lena

const Dashboard = () => {
  const [slots, setSlots] = useState({});
  const [lastEntry, setLastEntry] = useState(null);

  // ---------------- LIVE SOCKET LISTENERS ----------------
  useEffect(() => {
    socket.on("slot_update", (data) => {
      console.log("LIVE SLOTS:", data);
      setSlots(data.slots || {});
    });

    socket.on("lpr_update", (data) => {
      console.log("LIVE LPR:", data);
      setLastEntry(data);
    });

    return () => {
      socket.off("slot_update");
      socket.off("lpr_update");
    };
  }, []);

  // ---------------- SLOT COUNTS ----------------
  const totalSlots = Object.keys(slots).length;
  const occupiedCount = Object.values(slots).filter(
    (s) => s.occupied
  ).length;
  const availableCount = totalSlots - occupiedCount;

  return (
    <div className="p-6 flex-1 bg-gray-100 min-h-screen">

      {/* 🔢 Card Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">{availableCount}</h3>
          <p className="text-lg">Available</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">{occupiedCount}</h3>
          <p className="text-lg">Occupied</p>
        </div>

        <div className="bg-gray-400 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">0</h3>
          <p className="text-lg">Reserved</p>
        </div>
      </div>

      {/* 🚗 Last Entry (LPR) */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Last Entry</h3>

        {lastEntry ? (
          <div className="flex justify-between">
            <p><strong>Plate:</strong> {lastEntry.plate}</p>
            <p><strong>Time:</strong> {lastEntry.time}</p>
            <p className="text-green-600 font-semibold">
              {lastEntry.status}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Waiting for vehicle entry...</p>
        )}
      </div>

      {/* 🅿️ Live Slot Grid */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Parking Slots</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(slots).length === 0 && (
            <p className="text-gray-500">No slot data yet...</p>
          )}

          {Object.keys(slots).map((id) => (
            <div
              key={id}
              className={`p-4 rounded text-white text-center font-semibold ${
                slots[id].occupied ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {id}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
