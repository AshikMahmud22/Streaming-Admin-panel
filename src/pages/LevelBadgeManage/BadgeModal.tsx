import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { LevelBadge } from "./LevelBadgeManager";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBadge: LevelBadge | null;
}

export default function BadgeModal({ onClose, editingBadge }: BadgeModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [level, setLevel] = useState(editingBadge?.level.toString() || "");
  const [name, setName] = useState(editingBadge?.name || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(editingBadge?.url || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!level || (!preview && !selectedFile)) {
      toast.error("Please provide level and image");
      return;
    }

    setIsUploading(true);
    const tid = toast.loading(editingBadge ? "Updating..." : "Uploading...");

    try {
      let finalUrl = preview;

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: data }
        );
        const result = await res.json();
        finalUrl = result.secure_url;
      }

      const badgeData = {
        level: Number(level),
        name: name || `Level ${level}`,
        url: finalUrl,
      };

      if (editingBadge) {
        await updateDoc(doc(db, "level_badges", editingBadge.id), badgeData);
        toast.success("Badge updated", { id: tid });
      } else {
        await addDoc(collection(db, "level_badges"), badgeData);
        toast.success("Badge added", { id: tid });
      }

      onClose();
    } catch {
      toast.error("Action failed", { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center dark:bg-black/70 backdrop-blur-sm p-4 animate-in lg:pl-64 fade-in duration-200 bg-black/20">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold dark:text-white mb-8">
          {editingBadge ? "Edit Badge" : "Create New Badge"}
        </h3>

        <div className="space-y-6">
          <div
            onClick={() => document.getElementById("badge-upload")?.click()}
            className="aspect-square w-40 mx-auto border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group relative overflow-hidden"
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" alt="" />
            ) : (
              <div className="text-center">
                <ImageIcon className="text-gray-300 mx-auto mb-2" size={32} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Click to Upload PNG</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="text-white" />
            </div>
          </div>
          <input id="badge-upload" type="file" hidden accept="image/png" onChange={handleFileChange} />

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase ml-1">Target Level</label>
              <input
                type="number"
                placeholder="Ex: 5"
                className="w-full mt-1.5 p-4 rounded-2xl border dark:border-gray-800 bg-transparent dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase ml-1">Badge Title</label>
              <input
                type="text"
                placeholder="Ex: Bronze Warrior"
                className="w-full mt-1.5 p-4 rounded-2xl border dark:border-gray-800 bg-transparent dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={isUploading}
            onClick={handleSave}
            className="w-full py-5 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 bg-gray-200 hover:bg-gray-100 text-black"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : editingBadge ? "Update Badge" : "Publish Badge"}
          </button>
        </div>
      </div>
    </div>
  );
}