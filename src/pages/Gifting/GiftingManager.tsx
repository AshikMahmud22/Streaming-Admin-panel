import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, serverTimestamp } from "firebase/firestore";
import { GiftCard } from "./GiftCard";
import {GiftModal} from "./GiftModal";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { Gift } from "../../types";
import toast from "react-hot-toast";

export default function GiftingManager() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Gift | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gifts"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Gift);
      setGifts(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    } catch {
      toast.error("Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGifts(); }, []);

  const handleUpload = async (file: File): Promise<string> => {
    const data = new FormData();
    const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    data.append("file", file);
    data.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || "Upload failed");
    return result.secure_url;
  };

  const handleSubmit = async (formData: Partial<Gift>, file: File | null) => {
    if (!editData && !file) {
      toast.error("Please select a file first!");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(editData ? "Updating..." : "Deploying...");
    
    try {
      let finalUrl = formData.imageURL || "";
      if (file) finalUrl = await handleUpload(file);
      
      const payload = {
        name: formData.name,
        value: Number(formData.value),
        category: formData.category,
        imageURL: finalUrl,
        iconURL: finalUrl,
        updatedAt: serverTimestamp(),
      };

      if (editData?.id) {
        await updateDoc(doc(db, "gifts", editData.id), payload);
        toast.success("Successfully updated", { id: toastId });
      } else {
        await addDoc(collection(db, "gifts"), { ...payload, createdAt: serverTimestamp() });
        toast.success("Successfully added", { id: toastId });
      }
      
      setIsModalOpen(false);
      fetchGifts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold">Remove asset?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const delId = toast.loading("Deleting...");
              try {
                await deleteDoc(doc(db, "gifts", id));
                setGifts((prev) => prev.filter((g) => g.id !== id));
                toast.success("Deleted", { id: delId });
              } catch {
                toast.error("Error", { id: delId });
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-bold">
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className=" max-w-7xl mx-auto min-h-screen mt-5">
      <div className="flex justify-between items-center mb-10"> 
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-500" size={36} />
        <div>
         
          <h1 className="md:text-3xl text-xl font-semibold dark:text-white flex items-center gap-3">
             Asset Manager
          </h1>
          <p className="text-gray-500 text-xs mt-1  font-bold tracking-widest uppercase text-start">Inventory</p>
        </div>
        </div>
        
        <button
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-blue-950 hover:bg-blue-900 text-white md:px-8 md:py-4 rounded-2xl font-semibold px-4 py-4 flex items-center gap-2 md:shadow-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Add New Asset
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-400 font-black text-xs">SYNCING DATABASE</p>
        </div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-40 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
          <p className="text-gray-400 font-black">NO ASSETS DEPLOYED</p>
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 pt-5 gap-8 justify-center ">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onDelete={handleDelete}
              onEdit={(g) => { setEditData(g); setIsModalOpen(true); }}
            />
          ))}
        </div>
      )}

      <GiftModal
        isOpen={isModalOpen}
        isUploading={isUploading}
        initialData={editData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}