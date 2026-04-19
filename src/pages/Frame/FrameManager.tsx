import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { FrameCard } from "./FrameCard";
import { FrameModal } from "./FrameModal";

export interface FrameAsset {
  id: string;
  name: string;
  url: string;
  type: "png" | "svga";
  category: string;
  createdAt?: Timestamp;
}

export default function FrameManager() {
  const [frames, setFrames] = useState<FrameAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState<FrameAsset | null>(null);
  const [filter, setFilter] = useState("All categories");

  useEffect(() => {
    const q = query(collection(db, "frames"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as FrameAsset,
        );
        const sortedData = data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || Date.now();
          const timeB = b.createdAt?.toMillis() || Date.now();
          return timeB - timeA;
        });
        setFrames(sortedData);
        setLoading(false);
      },
      (error: Error) => {
        console.error(error);
        toast.error("Sync failed");
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleUpload = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: data,
      },
    );
    const result = await res.json();
    if (!res.ok) throw new Error("Upload failed");
    return result.secure_url;
  };

  const handleSubmit = async (
    formData: Partial<FrameAsset>,
    file: File | null,
  ) => {
    setIsUploading(true);
    const tid = toast.loading("Processing...");
    try {
      if (editData) {
        await updateDoc(doc(db, "frames", editData.id), formData);
        toast.success("Updated", { id: tid });
      } else {
        if (!file) throw new Error("File required");
        const url = await handleUpload(file);
        await addDoc(collection(db, "frames"), {
          ...formData,
          url,
          createdAt: serverTimestamp(),
        });
        toast.success("Added", { id: tid });
      }
      setIsModalOpen(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      toast.error(message, { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium dark:text-white text-gray-900">
          Remove this Frame?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading("Removing...");
              try {
                await deleteDoc(doc(db, "frames", id));
                toast.success("Removed", { id: tid });
              } catch {
                toast.error("Failed", { id: tid });
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const filtered = frames.filter(
    (f: FrameAsset) => filter === "All categories" || f.category === filter,
  );

  return (
    <div className=" min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-black">
            Frame Assets
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage SVGA and PNG frame overlays
          </p>
        </div>
       
      </div>

      <div className="mb-8 flex gap-3 text-nowrap justify-between items-center">
        <select
          className="w-full p-3 border dark:border-gray-800 rounded-xl outline-none text-sm bg-transparent dark:text-white text-black md:max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option className="text-black" value="All categories">All categories</option>
          <option className="text-black" value="Basic">Basic</option>
          <option className="text-black" value="Premium">Premium</option>
          <option className="text-black" value="Event">Event</option>
        </select>
         <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="dark:bg-black dark:text-white border dark:border-gray-800  bg-white  text-black px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 "
        >
          <Plus size={18} /> Add Frame
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 pt-5 gap-8 justify-center">
          {filtered.map((frame: FrameAsset) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              onEdit={(f: FrameAsset) => {
                setEditData(f);
                setIsModalOpen(true);
              }}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      <FrameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isUploading={isUploading}
        initialData={editData}
      />
    </div>
  );
}
