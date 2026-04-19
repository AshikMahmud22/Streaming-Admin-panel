import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Plus, Loader2, Palette } from "lucide-react";
import toast from "react-hot-toast";
import ThemeCard from "./ThemeCard";
import ThemeModal from "./ThemeModal";

export interface RoomTheme {
  id: string;
  themeId: number;
  url: string;
  name: string;
  price: number;
}

export default function RoomThemeManager() {
  const [themes, setThemes] = useState<RoomTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<RoomTheme | null>(null);

  useEffect(() => {
    const q = query(collection(db, "room_themes"), orderBy("themeId", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RoomTheme));
      setThemes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[220px]">
        <p className="text-sm font-bold leading-tight">
          Delete this skin permanently?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingId = toast.loading("Deleting...");
              try {
                await deleteDoc(doc(db, "room_themes", id));
                toast.success("Skin deleted", { id: loadingId });
              } catch {
                toast.error("Delete failed", { id: loadingId });
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: "top-right",
    });
  };

  const openEdit = (theme: RoomTheme) => {
    setEditingTheme(theme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTheme(null);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-row justify-between items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-black flex items-center gap-2">
            <Palette className="text-blue-500" /> Room Skins
          </h1>
          <p className="text-gray-500 text-sm mt-1">Vertical mobile backgrounds</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center border rounded-2xl w-12 h-12 md:w-44 dark:text-white justify-center dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-bold text-sm shadow-sm active:scale-95"
        >
          <Plus size={20} /> <span className="hidden md:inline ml-2">Add New Skin</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
      ) : (
        <div className="md:flex md:flex-wrap grid grid-cols-2 pt-5 gap-8 justify-center ">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onEdit={() => openEdit(theme)}
              onDelete={() => handleDelete(theme.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ThemeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          editingTheme={editingTheme}
        />
      )}
    </div>
  );
}