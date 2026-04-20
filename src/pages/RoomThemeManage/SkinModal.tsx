import { useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { Upload, Loader2, X, ImageIcon, Palette } from "lucide-react";
import toast from "react-hot-toast";
import { RoomTheme } from "./RoomSkinManager";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTheme: RoomTheme | null;
}

interface RoomSkinData {
  name: string;
  url: string;
  createdAt?: FieldValue;
}

export default function SkinModal({ onClose, editingTheme }: ThemeModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState(editingTheme?.name || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(editingTheme?.url || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name || (!preview && !selectedFile)) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsUploading(true);
    const tid = toast.loading(
      editingTheme ? "Updating Skin..." : "Uploading Skin...",
    );

    try {
      let finalUrl = preview;

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: data },
        );
        const result = await res.json();
        finalUrl = result.secure_url;
      }

      const skinData: RoomSkinData = {
        name: name,
        url: finalUrl,
      };

      if (editingTheme) {
        await updateDoc(doc(db, "room_skin", editingTheme.id), {
          name: skinData.name,
          url: skinData.url,
        });
        toast.success("Skin updated", { id: tid });
      } else {
        await addDoc(collection(db, "room_skin"), {
          ...skinData,
          createdAt: serverTimestamp(),
        });
        toast.success("New skin published", { id: tid });
      }

      onClose();
    } catch {
      toast.error("Action failed", { id: tid });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center dark:bg-black/70 bg-black/20 backdrop-blur-sm p-4 lg:pl-64 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
          <Palette size={24} className="text-blue-500" />
          {editingTheme ? "Edit Room Skin" : "New Room Skin"}
        </h3>

        <div className="space-y-6">
          <div
            onClick={() => document.getElementById("theme-upload")?.click()}
            className="aspect-video w-full border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group relative overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt=""
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="text-gray-300 mx-auto mb-2" size={32} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Select Skin Background
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="text-white" />
            </div>
          </div>
          <input
            id="theme-upload"
            type="file"
            hidden
            onChange={handleFileChange}
          />

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase ml-1 tracking-wider">
                Skin Name
              </label>
              <input
                type="text"
                placeholder="Ex: Pink Galaxy"
                className="w-full mt-1.5 p-4 rounded-2xl border dark:border-gray-800 bg-transparent dark:text-white outline-none focus:ring-2 ring-blue-950 font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={isUploading}
            onClick={handleSave}
            className="w-full py-5 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-black bg-gray-200 hover:bg-gray-100"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" />
            ) : editingTheme ? (
              "Update Skin"
            ) : (
              "Publish Skin"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}