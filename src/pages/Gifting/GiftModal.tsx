import { useState, useEffect, FormEvent } from "react";
import {
  X,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { Gift } from "../../types";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Gift>, file: File | null) => void;
  initialData?: Gift | null;
  isUploading: boolean;
}

const CATEGORIES = ["Uncategorized", "Lucky", "Luxury", "Romantic", "Event"];

export const GiftModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isUploading,
}: GiftModalProps) => {
  const [formData, setFormData] = useState<Partial<Gift>>({
    name: "",
    value: "",
    category: "Uncategorized",
  });
  const [file, setFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<"png" | "svga">("png");

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setAssetType(
        initialData.imageURL?.toLowerCase().endsWith(".svga") ? "svga" : "png",
      );
    } else {
      setFormData({ name: "", value: "", category: "Uncategorized" });
      setAssetType("png");
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4  backdrop-blur-md lg:pl-64">
      <div className=" dark:bg-gray-900 bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border md:border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black dark:text-white">
            {initialData ? "Edit Asset" : "New Asset"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white transition-colors hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setAssetType("png")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${assetType === "png" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-500" : "text-gray-500"}`}
          >
            <ImageIcon size={16} /> PNG Image
          </button>
          <button
            type="button"
            onClick={() => setAssetType("svga")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${assetType === "svga" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-500" : "text-gray-500"}`}
          >
            <Film size={16} /> SVGA Animation
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            onSubmit(formData, file);
          }}
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">
              Asset Identity
            </label>
            <input
              type="text"
              placeholder="e.g. Diamond Ring"
              required
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none dark:text-white border  focus:border-blue-500 transition-all"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">
              Coin Value
            </label>
            <input
              type="number"
              placeholder="0"
              required
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none dark:text-white font-mono border  focus:border-blue-500 transition-all"
              value={formData.value || ""}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">
              Collection Category
            </label>
            <select
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none dark:text-white border  focus:border-blue-500 transition-all appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">
              Upload {assetType.toUpperCase()}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group">
              <UploadCloud className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs text-gray-500 mt-2 font-medium px-4 text-center line-clamp-1">
                {file ? file.name : `Select .${assetType} file`}
              </span>
              <input
                type="file"
                className="hidden"
                accept={`.${assetType}`}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            disabled={isUploading}
            className="w-full dark:bg-blue-200  h-14 rounded-2xl font-semibold shadow shadow-blue-500/25 bg-gray-200 text-black  disabled:bg-gray-400 transition-all mt-4 hover:bg-gray-100 flex items-center justify-center"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : initialData ? (
              "Update Database"
            ) : (
              "Deploy Asset"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
