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
  where,
} from "firebase/firestore";
import { Plus, Loader2 } from "lucide-react";
import { EmojiCard } from "./EmojiCard";
import { EmojiModal } from "./EmojiModal";
import toast from "react-hot-toast";

interface Emoji {
  id: string;
  name: string;
  imageURL: string;
  category: string;
  subCategory?: string;
  value?: number;
  isActive?: boolean;
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
    const q = query(collection(db, "store"), where("category", "==", "Emoji"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Emoji);
        const sortedData = data.sort((a, b) => {
          const timeB = b.createdAt?.toMillis() || 0;
          const timeA = a.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });
        setEmojis(sortedData);
        setLoading(false);
      },
      () => {
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
      { method: "POST", body: data },
    );
    const result = await res.json();
    if (!res.ok) throw new Error("Upload failed");
    return result.secure_url;
  };

  const handleSubmit = async (formData: Partial<Emoji>, file: File | null) => {
    setIsUploading(true);
    const tid = toast.loading("Saving...");
    try {
      let finalUrl = editData?.imageURL || "";

      if (file) {
        finalUrl = await handleUpload(file);
      }

      const payload = {
        name: formData.name,
        imageURL: finalUrl,
        category: "Emoji",
        subCategory: formData.category || "Uncategorized",
        value: Number(formData.value || 0),
        isActive: true,
        updatedAt: serverTimestamp(),
      };

      if (editData) {
        await updateDoc(doc(db, "store", editData.id), payload);
        toast.success("Updated", { id: tid });
      } else {
        if (!file) throw new Error("Image required");
        await addDoc(collection(db, "store"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Added", { id: tid });
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error", { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium dark:text-white">
          Delete this emoji?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading("Deleting...");
              try {
                await deleteDoc(doc(db, "store", id));
                toast.success("Deleted", { id: tid });
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
            className="bg-gray-200 text-black px-3 py-1 rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const filteredEmojis = emojis.filter(
    (e) => filter === "All categories" || e.subCategory === filter,
  );

  return (
    <div className="md:p-8 min-h-screen text-white">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl border dark:border-gray-800">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">
            Total
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
            {new Set(emojis.map((e) => e.subCategory)).size}
          </h2>
        </div>
        <div className="p-6 rounded-2xl border dark:border-gray-800 hidden md:block">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Last</p>
          <h2 className="text-xl flex items-center gap-2 dark:text-white text-black truncate">
            {emojis[0] && (
              <>
                <img
                  src={emojis[0].imageURL}
                  className="w-6 h-6 object-contain"
                />{" "}
                {emojis[0].name}
              </>
            )}
          </h2>
        </div>
      </div>

      <div className="flex gap-4 mb-10 justify-between items-center">
        <select
          className="p-3 border dark:border-gray-800 rounded-xl text-black dark:text-white bg-transparent outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option className="text-black" value="All categories">All categories</option>
          <option className="text-black" value="Faces">Faces</option>
          <option className="text-black" value="Symbols">Symbols</option>
          <option className="text-black" value="Nature">Nature</option>
        </select>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="bg-black dark:border border-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add Emoji
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 gap-8 justify-center">
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
