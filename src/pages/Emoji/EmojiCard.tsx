import { Edit3, Trash2 } from "lucide-react";

interface Emoji {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface EmojiCardProps {
  emoji: Emoji;
  onEdit: (emoji: Emoji) => void;
  onDelete: (id: string) => void;
}

export const EmojiCard = ({ emoji, onEdit, onDelete }: EmojiCardProps) => {
  return (
    <div className="border dark:border-gray-800 rounded-2xl p-5 w-50  flex flex-col items-center group dark:hover:border-gray-700 transition-all">
      <div className="w-16 h-16 flex items-center justify-center mb-3">
        <img src={emoji.url} alt={emoji.name} className="w-full h-full object-contain" />
      </div>
      
      <h3 className="dark:text-white text-black font-bold text-sm mb-1">{emoji.name}</h3>
      <span className=" text-gray-400 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider mb-4">
        {emoji.category}
      </span>

      <div className="grid grid-cols-2 gap-2 w-full">
        <button 
          onClick={() => onEdit(emoji)}
          className="flex items-center justify-center gap-2 py-2 dark:hover:bg-blue-200/20 hover:bg-[#ecf5f0] dark:text-white text-black text-xs font-bold rounded-lg border dark:border-gray-700 transition-colors"
        >
          <Edit3 size={14} /> Edit
        </button>
        <button 
          onClick={() => onDelete(emoji.id)}
          className="flex items-center justify-center gap-2 py-2  hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50 dark:text-white text-black text-xs font-bold rounded-lg border dark:border-gray-700 transition-all "
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};