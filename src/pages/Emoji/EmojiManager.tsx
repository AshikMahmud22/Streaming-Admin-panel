import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
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

  const fetchEmojis = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "emojis"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Emoji);
      setEmojis(
        data.sort(
          (a, b) =>
            (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0),
        ),
      );
    } catch {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmojis();
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
      fetchEmojis();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error occurred";
      toast.error(msg, { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredEmojis = emojis.filter(
    (e) => filter === "All categories" || e.category === filter,
  );
  const categoriesCount = new Set(emojis.map((e) => e.category)).size;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen  text-white">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className=" p-6 rounded-2xl border dark:border-gray-800">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Total emojis
          </p>
          <h2 className="text-3xl font-black dark:text-white text-black">
            {emojis.length}
          </h2>
        </div>
        <div className=" p-6 rounded-2xl border dark:border-gray-800">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Categories
          </p>
          <h2 className="text-3xl font-black dark:text-white text-black">
            {categoriesCount}
          </h2>
        </div>
        <div className=" p-6 rounded-2xl border dark:border-gray-800 hidden md:block">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Last added
          </p>
          <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white text-black">
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

      <div className=" mb-3">
        <h1 className="text-2xl font-bold">Emoji manager</h1>
      </div>

      <div className="flex gap-4 mb-10 justify-between items-center">
        <div className="relative flex-1 max-w-xs">
          <select
            className="w-full p-3  border dark:border-gray-800 rounded-xl outline-none text-sm appearance-none cursor-pointer text-black dark:text-white "
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option className="text-black">All categories</option>
            <option className="text-black">Faces</option>
            <option className="text-black">Symbols</option>
            <option className="text-black">Nature</option>
          </select>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className=" border dark:border-gray-700 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2  transition-all text-black dark:text-white"
        >
          <Plus size={18} /> Add emoji
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {filteredEmojis.map((emoji) => (
            <EmojiCard
              key={emoji.id}
              emoji={emoji}
              onEdit={(e) => {
                setEditData(e);
                setIsModalOpen(true);
              }}
              onDelete={async (id) => {
                if (confirm("Delete this asset?")) {
                  await deleteDoc(doc(db, "emojis", id));
                  fetchEmojis();
                }
              }}
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
