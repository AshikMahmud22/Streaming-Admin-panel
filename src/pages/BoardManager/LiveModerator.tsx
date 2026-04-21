import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { rtdb } from "../../lib/firebase";
import { MicOff, UserMinus, Ban, ShieldX, Clock } from "lucide-react";
import { handleModerationAction } from "../../utils/moderationService";

interface ParticipantData {
  isOnline?: boolean;
  joinedAt?: number;
  role?: string;
  [key: string]: unknown;
}

interface Participant extends ParticipantData {
  id: string;
}

export default function LiveModerator() {
  const { mode, roomId } = useParams<{ mode: "audio" | "video"; roomId: string }>();
  const [users, setUsers] = useState<Participant[]>([]);

useEffect(() => {
  if (!mode || !roomId) return;

  const path = mode === "audio" ? `room_participants/${roomId}` : `live_participants/${roomId}`;
  console.log("Checking Path:", path); // চেক করুন পাথটি ঠিক আছে কি না

  const participantsRef = ref(rtdb, path);

  const unsubscribe: Unsubscribe = onValue(participantsRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Database Snapshot:", data); // এখানে কি null আসে নাকি ডাটা আসে?
    
    if (data) {
      const userList = Object.keys(data).map(id => ({
        id,
        ...data[id] as ParticipantData
      }));
      setUsers(userList);
    } else {
      setUsers([]);
    }
  });

  return () => unsubscribe();
}, [roomId, mode]);

  if (!mode || !roomId) {
    return (
      <div className="p-10 text-center dark:text-white">
        Invalid Configuration: Missing Room ID or Mode.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 p-5 rounded-[2rem] border dark:border-gray-800 shadow-xl">
      <div className="flex justify-between mb-5">
        <h3 className="font-black text-xl tracking-tight dark:text-white uppercase">
          {mode} Live Management
        </h3>
      </div>

      <div className="grid gap-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.id.slice(-4)}
                </div>
                <span className="text-sm font-bold dark:text-gray-300">{user.id.slice(0, 10)}...</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleModerationAction(mode, roomId, user.id, "mute")} 
                  className="p-2 hover:bg-orange-100 text-orange-500 rounded-lg transition-all"
                >
                  <MicOff size={18} />
                </button>

                <button 
                  onClick={() => handleModerationAction(mode, roomId, user.id, "kickout")} 
                  className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-all"
                >
                  <UserMinus size={18} />
                </button>

                <div className="relative group">
                  <button className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-all">
                    <Ban size={18} />
                  </button>
                  
                  <div className="absolute right-0 bottom-full mb-3 hidden group-hover:block w-44 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-2xl p-2 z-[100]">
                    <button 
                      onClick={() => handleModerationAction(mode, roomId, user.id, "24h")} 
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-bold dark:text-white"
                    >
                      <Clock size={14}/> 24 Hours Remove
                    </button>
                    <button 
                      onClick={() => handleModerationAction(mode, roomId, user.id, "7d")} 
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-bold dark:text-white"
                    >
                      <Clock size={14}/> 7 Days Remove
                    </button>
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1" />
                    <button 
                      onClick={() => handleModerationAction(mode, roomId, user.id, "block")} 
                      className="w-full flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-xl text-xs font-black"
                    >
                      <ShieldX size={14}/> Permanent Block
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No active participants found.
          </div>
        )}
      </div>
    </div>
  );
}