import React, { useState, useEffect } from "react";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { rtdb } from "../../lib/firebase";
import { Link } from "react-router";
import { Video, Activity, ArrowRight } from "lucide-react";

interface LiveStream {
  id: string;
  title?: string;
  status?: string;
  hostId?: string;
  [key: string]: unknown;
}

export default function VideoLiveList() {
  const [streams, setStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const streamsRef = ref(rtdb, "live_streams");
    const unsubscribe: Unsubscribe = onValue(streamsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<LiveStream, "id">> | null;
      if (data) {
        const streamList: LiveStream[] = Object.keys(data).map(id => ({
          id,
          ...data[id]
        }));
        setStreams(streamList);
      } else {
        setStreams([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-2 text-gray-800">
        <Video className="text-purple-500" /> Active Video Streams
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <div key={stream.id} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 shadow-sm border-t-4 border-t-purple-500 transition-hover hover:shadow-md">
            <h3 className="font-bold dark:text-white truncate text-gray-800">
              {stream.title || "Live Stream"}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <Activity size={14} /> <span>Status: {stream.status || "Live"}</span>
            </div>
            <Link 
              to={`/live-moderate/video/${stream.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              Manage Stream <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}