import { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { X, Upload, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

interface AgencyModalProps {
  onClose: () => void;
}

interface FileStore {
  logo: File | null;
  nidFront: File | null;
  nidBack: File | null;
}

export default function AgencyModal({ onClose }: AgencyModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileStore>({ logo: null, nidFront: null, nidBack: null });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>, key: keyof FileStore) => {
    if (e.target.files?.[0]) setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.logo || !files.nidFront || !files.nidBack) return toast.error("All files required");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const ownerId = fd.get("ownerId") as string;

    try {
      const [lUrl, fUrl, bUrl] = await Promise.all([
        uploadToCloudinary(files.logo),
        uploadToCloudinary(files.nidFront),
        uploadToCloudinary(files.nidBack)
      ]);

      const agencyId = `AG_${Date.now()}`;
      await setDoc(doc(db, "agencies", agencyId), {
        name: fd.get("name"),
        holderName: fd.get("holderName"),
        whatsapp: fd.get("whatsapp"),
        country: fd.get("country"),
        email: fd.get("email"),
        ownerId,
        logo: lUrl,
        nidFront: fUrl,
        nidBack: bUrl,
        status: "active",
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, "users", ownerId), {
        isAgency: true,
        agencyId,
        role: "owner"
      });

      toast.success("Agency registered successfully");
      onClose();
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-black dark:text-white">Agency Registration</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          <input name="name" required placeholder="Agency Name" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500/20 text-white" />
          <input name="holderName" required placeholder="Holder Name" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500/20 text-white" />
          <input name="whatsapp" required placeholder="WhatsApp (e.g. +880...)" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500/20 text-white" />
          <input name="ownerId" required placeholder="Owner UID (Firebase)" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500/20 text-white" />
          <input name="email" type="email" required placeholder="Contact Email" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500/20 text-white" />
          
          <select name="country" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-5 py-4 outline-none text-white">
            <option value="Bangladesh">Bangladesh</option>
            <option value="India">India</option>
            <option value="Pakistan">Pakistan</option>
          </select>

          <div className="md:col-span-2 grid grid-cols-3 gap-4 mt-2">
            {(['logo', 'nidFront', 'nidBack'] as const).map(k => (
              <label key={k} className={`relative border-2 border-dashed ${files[k] ? 'border-green-500 bg-green-500/5' : 'border-gray-200 dark:border-gray-800 hover:border-blue-500'} rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group`}>
                {files[k] ? <Check className="text-green-500 mb-2" /> : <Upload className="text-gray-400 group-hover:text-blue-500 mb-2" />}
                <span className="text-[10px] font-black uppercase text-gray-500">{k.replace(/([A-Z])/g, ' $1')}</span>
                <input type="file" hidden accept="image/*" onChange={(e) => handleFile(e, k)} />
                {files[k] && <div className="absolute inset-0 bg-green-500 rounded-[28px] flex items-center justify-center text-[10px] font-bold text-white px-2 text-center opacity-0 hover:opacity-100 transition-opacity">Change {k}</div>}
              </label>
            ))}
          </div>

          <button disabled={loading} className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg">
            {loading ? <><Loader2 className="animate-spin" /> Processing Documents...</> : "Create Approved Agency"}
          </button>
        </form>
      </div>
    </div>
  );
}