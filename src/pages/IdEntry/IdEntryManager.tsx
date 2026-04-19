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
import { IdEntryCard } from "./IdEntryCard";
import { IdEntryModal } from "./IdEntryModal";

export interface IdEntry {
  id: string;
  name: string;
  url: string;
  type: "png" | "svga";
  category: string;
  createdAt?: Timestamp;
}

export default function IdEntryManager() {
  const [entries, setEntries] = useState<IdEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState<IdEntry | null>(null);
  const [filter, setFilter] = useState("All categories");

  useEffect(() => {
    const q = query(collection(db, "id_entries"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as IdEntry,
        );

        const sortedData = data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || Date.now();
          const timeB = b.createdAt?.toMillis() || Date.now();
          return timeB - timeA;
        });

        setEntries(sortedData);
        setLoading(false);
      },
      (error) => {
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
    formData: Partial<IdEntry>,
    file: File | null,
  ) => {
    setIsUploading(true);
    const tid = toast.loading("Processing...");
    try {
      if (editData) {
        await updateDoc(doc(db, "id_entries", editData.id), formData);
        toast.success("Updated", { id: tid });
      } else {
        if (!file) throw new Error("File required");
        const url = await handleUpload(file);
        await addDoc(collection(db, "id_entries"), {
          ...formData,
          url,
          createdAt: serverTimestamp(),
        });
        toast.success("Added", { id: tid });
      }
      setIsModalOpen(false);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error occurred";
      toast.error(errorMessage, { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium dark:text-white text-gray-900">
          Remove this ID Entry?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading("Removing...");
              try {
                await deleteDoc(doc(db, "id_entries", id));
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

  const filtered = entries.filter(
    (e) => filter === "All categories" || e.category === filter,
  );

  return (
    <div className=" min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-black">
            ID Entry Assets
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage SVGA and PNG entry effects
          </p>
        </div>
       
      </div>

      <div className="mb-8 flex gap-3 text-nowrap justify-between items-center ">
        <select
          className="w-full p-3 border dark:border-gray-800 rounded-xl outline-none text-sm bg-transparent dark:text-white text-black cursor-pointer md:max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option className="text-black" value="All categories">
            All categories
          </option>
          <option className="text-black" value="Vip">
            Vip
          </option>
          <option className="text-black" value="Luxury">
            Luxury
          </option>
          <option className="text-black" value="Special">
            Special
          </option>
        </select>
         <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="darK:bg-black  dark:text-white text-black px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border dark:border-gray-800"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 pt-5 gap-8 justify-center">
          {filtered.map((entry) => (
            <IdEntryCard
              key={entry.id}
              entry={entry}
              onEdit={(e) => {
                setEditData(e);
                setIsModalOpen(true);
              }}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      <IdEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isUploading={isUploading}
        initialData={editData}
      />
    </div>
  );
}
