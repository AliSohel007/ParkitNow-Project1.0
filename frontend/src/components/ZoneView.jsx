import React from 'react';
import { FaCarSide } from 'react-icons/fa'; // Car icon

const ZoneView = () => {
  // Dummy floor and slot data
  const floors = {
    "Level 1": ["A1", "A2", "A3", "A4"],
    "Level 2": ["B1", "B2", "B3", "B4"]
  };

  // Dummy status for each slot
  const slotStatus = {
    A1: "occupied",
    A2: "vacant",
    A3: "occupied",
    A4: "vacant",
    B1: "vacant",
    B2: "vacant",
    B3: "occupied",
    B4: "vacant"
  };

  return (
    <div className="p-4 space-y-8">
      {Object.entries(floors).map(([level, slots]) => (
        <div key={level}>
          <h2 className="text-xl font-bold text-gray-700 mb-2">{level}</h2>
          <div className="grid grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot}
                className={`rounded-xl p-4 text-white flex items-center justify-between shadow-md
                  ${slotStatus[slot] === 'occupied' ? 'bg-red-500' : 'bg-green-500'}
                `}
              >
                <span className="font-bold">{slot}</span>
                <FaCarSide className="text-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZoneView;
