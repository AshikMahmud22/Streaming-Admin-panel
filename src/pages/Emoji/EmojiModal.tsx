import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";

interface Emoji {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface EmojiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Emoji>, file: File | null) => void;
  isUploading: boolean;
  initialData?: Emoji | null;
}

export const EmojiModal = ({ isOpen, onClose, onSubmit, isUploading, initialData }: EmojiModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Faces");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
    } else {
      setName("");
      setCategory("Faces");
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4   backdrop-blur-sm lg:pl-64 dark:bg-black/80 ">
      <div className=" w-full max-w-md  rounded-[2rem] p-8 border dark:bg-gray-900 dark:border-gray-800 shadow-2xl bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white text-black">{initialData ? "Edit Emoji" : "Add New Emoji"}</h2>
          <button onClick={onClose} className="text-gray-400  hover:text-red-500"><X size={24} /></button>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, category }, file); }}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Name</label>
            <input 
              type="text" 
              required
              placeholder="Name.."
              className="w-full mt-1 p-4  rounded-xl outline-none dark:text-white border dark:border-gray-800 text-black  focus:border-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
            <select 
              className="w-full mt-1 p-4  rounded-xl outline-none dark:text-white border dark:border-gray-800 focus:border-blue-500 transition-all appearance-none text-black cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option className="text-black" value="Faces">Faces</option>
              <option className="text-black" value="Symbols">Symbols</option>
              <option className="text-black" value="Nature">Nature</option>
              <option className="text-black" value="Gestures">Gestures</option>
              <option className="text-black" value="Celebration">Celebration</option>
            </select>
          </div>

          {!initialData && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Asset (PNG/WebP)</label>
              <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed dark:border-gray-800 rounded-xl cursor-pointer hover: transition-all">
                <UploadCloud className="text-gray-500 mb-2" />
                <span className="text-xs text-gray-400">{file ? file.name : "Select File"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          )}

          <button 
            disabled={isUploading}
            className="w-full text-black h-14 rounded-xl font-bold bg-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center dark:bg-blue-200 disabled:bg-gray-600 border"
          >
            {isUploading ? <Loader2 className="animate-spin" size={24} /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};