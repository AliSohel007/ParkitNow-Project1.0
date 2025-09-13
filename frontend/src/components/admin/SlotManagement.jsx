import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../config/api";  // ✅ import API base

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState(50);
  const [status, setStatus] = useState("vacant");
  const [reserved, setReserved] = useState(false);
  const [editSlotId, setEditSlotId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Failed to fetch slots");
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    setNewSlot("");
    setLocation("");
    setRate(50);
    setStatus("vacant");
    setReserved(false);
    setEditSlotId(null);
  };

  const handleCreateOrUpdateSlot = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newSlot) return setError("Slot name is required");

    const slotData = { slot: newSlot, location, rate, status, reserved };

    try {
      if (editSlotId) {
        await axios.put(`${API_BASE}/api/slots/${editSlotId}`, slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(`Slot "${newSlot}" updated`);
      } else {
        await axios.post(`${API_BASE}/api/slots`, slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(`Slot "${newSlot}" created`);
      }
      resetForm();
      fetchSlots();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save slot");
    }
  };

  const handleEdit = (slot) => {
    setEditSlotId(slot._id);
    setNewSlot(slot.slot);
    setLocation(slot.location || "");
    setRate(slot.rate);
    setStatus(slot.status);
    setReserved(slot.reserved);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Slot deleted");
      fetchSlots();
    } catch (err) {
      console.error(err);
      setError("Failed to delete slot");
    }
  };

  // ✅ Filter + Search Logic
  const filteredSlots = slots.filter((slot) => {
    const matchesFilter =
      (filter === "vacant" && slot.status === "vacant") ||
      (filter === "occupied" && slot.status === "occupied") ||
      (filter === "reserved" && slot.reserved === true) ||
      filter === "all";

    const matchesSearch = slot.slot
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {editSlotId ? "Edit Slot" : "Add New Slot"}
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      {/* Form */}
      <form onSubmit={handleCreateOrUpdateSlot} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Slot name (e.g. A1)"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Rate (₹)"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={reserved}
            onChange={(e) => setReserved(e.target.checked)}
          />
          Reserved
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editSlotId ? "Update Slot" : "Add Slot"}
          </button>
          {editSlotId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter & Search */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div>
          <label className="mr-2 font-medium">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search slot name (e.g. A1)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSlots.map((slot) => (
          <div
            key={slot._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <div>
              <p className="text-lg font-semibold">Slot: {slot.slot}</p>

              <p className="flex items-center gap-2">
                Status:
                <span
                  className={`px-2 py-1 rounded text-white text-sm font-semibold ${
                    slot.status === "vacant" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {slot.status === "vacant" ? "🟢 Vacant" : "🔴 Occupied"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                Reserved:
                <span
                  className={`px-2 py-1 rounded text-white text-sm font-semibold ${
                    slot.reserved ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                >
                  {slot.reserved ? "🟡 Reserved" : "No"}
                </span>
              </p>

              <p>Rate: ₹{slot.rate}</p>
              <p>Location: {slot.location || "-"}</p>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(slot)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slot._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotManagement;
