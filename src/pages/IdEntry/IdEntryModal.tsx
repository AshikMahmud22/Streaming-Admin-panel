import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { IdEntry } from "./IdEntryManager";

interface IdEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IdEntry>, file: File | null) => void;
  isUploading: boolean;
  initialData?: IdEntry | null;
}

export const IdEntryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isUploading,
  initialData,
}: IdEntryModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vip");
  const [type, setType] = useState<"png" | "svga">("png");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setType(initialData.type);
    } else {
      setName("");
      setCategory("Vip");
      setType("png");
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-sm lg:pl-64 dark:bg-black/80 bg-black/20">
      <div className="w-full max-w-md rounded-[2rem] p-8 border dark:bg-gray-900  dark:border-gray-800 shadow-2xl bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white text-black">
            {initialData ? "Edit Entry" : "Add ID Entry"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, category, type }, file);
          }}
        >
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Entry name.."
              className="w-full mt-1 p-4 rounded-xl outline-none dark:text-white border dark:border-gray-800 text-black focus:border-blue-500 transition-all bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Category
              </label>
              <select
                className="w-full mt-1 p-4 rounded-xl outline-none dark:text-white border dark:border-gray-800 text-black cursor-pointer bg-transparent appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option className="text-black " value="Vip">Vip</option>
                <option className="text-black " value="Luxury">Luxury</option>
                <option className="text-black " value="Special">Special</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                File Type
              </label>
              <select
                className="w-full mt-1 p-4 rounded-xl outline-none dark:text-white border dark:border-gray-800 text-black cursor-pointer bg-transparent appearance-none"
                value={type}
                onChange={(e) => setType(e.target.value as "png" | "svga")}
              >
                <option className="text-black" value="png">PNG</option>
                <option className="text-black" value="svga">SVGA</option>
              </select>
            </div>
          </div>

          {!initialData && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Asset ({type.toUpperCase()})
              </label>
              <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed dark:border-gray-800 rounded-xl cursor-pointer hover:transition-all">
                <UploadCloud className="text-gray-500 mb-2" />
                <span className="text-xs text-gray-400">
                  {file ? file.name : `Select ${type.toUpperCase()} File`}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={type === "png" ? "image/png" : ".svga"}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          )}

          <button
            disabled={isUploading}
            className="w-full text-black h-14 rounded-xl font-bold bg-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center dark:bg-blue-200 disabled:bg-gray-600 border"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Save Entry"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
