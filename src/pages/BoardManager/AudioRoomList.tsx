import React, { useState, useEffect } from "react";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { rtdb } from "../../lib/firebase";
import { Link } from "react-router";
import { Mic, Users, ArrowRight } from "lucide-react";

interface AudioRoom {
  id: string;
  roomName?: string;
  hostId?: string;
  [key: string]: unknown;
}

export default function AudioRoomList() {
  const [rooms, setRooms] = useState<AudioRoom[]>([]);

  useEffect(() => {
    const roomsRef = ref(rtdb, "rooms");
    const unsubscribe: Unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<AudioRoom, "id">> | null;
      if (data) {
        const roomList: AudioRoom[] = Object.keys(data).map(id => ({
          id,
          ...data[id]
        }));
        setRooms(roomList);
      } else {
        setRooms([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-2 text-gray-800">
        <Mic className="text-blue-500" /> Active Audio Rooms
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 shadow-sm transition-hover hover:shadow-md">
            <h3 className="font-bold dark:text-white truncate text-gray-800">
              {room.roomName || "Untitled Room"}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <Users size={14} /> <span>ID: {room.id.slice(0, 10)}...</span>
            </div>
            <Link 
              to={`/live-moderate/audio/${room.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              Manage Room <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}