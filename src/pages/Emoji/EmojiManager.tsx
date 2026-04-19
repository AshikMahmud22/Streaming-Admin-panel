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
import { EmojiCard } from "./EmojiCard";
import { EmojiModal } from "./EmojiModal";
import toast from "react-hot-toast";

interface Emoji {
  id: string;
  name: string;
  url: string;
  category: string;
  createdAt?: Timestamp;
}

export default function EmojiManager() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState<Emoji | null>(null);
  const [filter, setFilter] = useState("All categories");

  useEffect(() => {
    const q = query(collection(db, "emojis"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Emoji);
      const sortedData = data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || Date.now();
        const timeB = b.createdAt?.toMillis() || Date.now();
        return timeB - timeA;
      });
      setEmojis(sortedData);
      setLoading(false);
    }, () => {
      toast.error("Sync failed");
      setLoading(false);
    });

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

  const handleSubmit = async (formData: Partial<Emoji>, file: File | null) => {
    setIsUploading(true);
    const tid = toast.loading("Saving...");
    try {
      if (editData) {
        await updateDoc(doc(db, "emojis", editData.id), formData);
        toast.success("Updated", { id: tid });
      } else {
        if (!file) throw new Error("File required");
        const url = await handleUpload(file);
        await addDoc(collection(db, "emojis"), {
          ...formData,
          url,
          createdAt: serverTimestamp(),
        });
        toast.success("Added", { id: tid });
      }
      setIsModalOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error occurred";
      toast.error(msg, { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium dark:text-white text-gray-900">
            Delete this asset?
          </p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const tid = toast.loading("Deleting...");
                try {
                  await deleteDoc(doc(db, "emojis", id));
                  toast.success("Deleted", { id: tid });
                } catch {
                  toast.error("Delete failed", { id: tid });
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
      ),
      { duration: 4000 },
    );
  };

  const filteredEmojis = emojis.filter(
    (e) => filter === "All categories" || e.category === filter,
  );
  const categoriesCount = new Set(emojis.map((e) => e.category)).size;

  return (
    <div className="p-8 min-h-screen text-white">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl border dark:border-gray-800">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Total emojis
          </p>
          <h2 className="text-3xl font-semibold dark:text-white text-black">
            {emojis.length}
          </h2>
        </div>
        <div className="p-6 rounded-2xl border dark:border-gray-800">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Categories
          </p>
          <h2 className="text-3xl font-semibold dark:text-white text-black">
            {categoriesCount}
          </h2>
        </div>
        <div className="p-6 rounded-2xl border dark:border-gray-800 hidden md:block">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Last added
          </p>
          <h2 className="text-xl flex items-center gap-2 dark:text-white text-black">
            {emojis[0] ? (
              <>
                <img src={emojis[0].url} className="w-6 h-6" /> {emojis[0].name}
              </>
            ) : (
              "None"
            )}
          </h2>
        </div>
      </div>

      <div className="mb-3">
        <h1 className="text-2xl font-bold">Emoji manager</h1>
      </div>

      <div className="flex gap-4 mb-10 justify-between items-center">
        <div className="relative flex-1 max-w-xs">
          <select
            className="w-full p-3 border dark:border-gray-800 rounded-xl outline-none text-sm appearance-none cursor-pointer text-black dark:text-white bg-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option className="text-black" value="All categories">
              All categories
            </option>
            <option className="text-black" value="Faces">
              Faces
            </option>
            <option className="text-black" value="Symbols">
              Symbols
            </option>
            <option className="text-black" value="Nature">
              Nature
            </option>
          </select>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="border dark:border-gray-700 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-black dark:text-white"
        >
          <Plus size={18} /> Add emoji
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 pt-5 gap-8 justify-center">
          {filteredEmojis.map((emoji) => (
            <EmojiCard
              key={emoji.id}
              emoji={emoji}
              onEdit={(e) => {
                setEditData(e);
                setIsModalOpen(true);
              }}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      <EmojiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isUploading={isUploading}
        initialData={editData}
      />
    </div>
  );
}