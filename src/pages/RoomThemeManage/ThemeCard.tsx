import { Edit3, Trash2, Coins } from "lucide-react";
import { RoomTheme } from "./RoomThemeManager";

interface ThemeCardProps {
  theme: RoomTheme;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ThemeCard({ theme, onEdit, onDelete }: ThemeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 w-50  rounded-[2rem] p-3 flex flex-col gap-3 aspect-4/6 transition-all hover:shadow-xl group">
      <div className="  w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-inner">
        <img
          src={theme.url}
          alt={theme.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
          <p className="text-[8px] font-black text-white uppercase tracking-tighter">
            ID: {theme.themeId}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-10">
          <h4 className="text-xs font-bold text-white truncate">
            {theme.name}
          </h4>
          <div className="flex items-center gap-1 mt-0.5 text-orange-400">
            <Coins size={10} />
            <span className="text-[10px] font-black">{theme.price}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={onEdit}
          className="flex items-center justify-center py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-purple-500 hover:text-white transition-all active:scale-90 shadow-sm"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
