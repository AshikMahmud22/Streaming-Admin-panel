import { PencilLine, X } from "lucide-react";
import { IdEntry } from "./IdEntryManager";
import { SVGAPreview } from "../Gifting/SVGAPreview";

interface IdEntryCardProps {
  entry: IdEntry;
  onEdit: (entry: IdEntry) => void;
  onDelete: (id: string) => void;
}

export const IdEntryCard = ({ entry, onEdit, onDelete }: IdEntryCardProps) => {
  return (
    <div className="group relative border dark:border-gray-800 md:w-50 rounded-3xl p-4 transition-all hover:shadow-xl bg-white dark:bg-gray-900">
      <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center overflow-hidden border dark:border-none">
        {entry.type === "png" ? (
          <img 
            src={entry.url} 
            alt={entry.name} 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="w-full h-full">
            <SVGAPreview url={entry.url} />
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-bold truncate dark:text-white text-black">
        {entry.name}
      </h3>
      <p className="text-[10px] text-gray-500 uppercase font-bold">
        {entry.category}
      </p>
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(entry)} 
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm text-blue-500 hover:scale-110 transition-transform"
        >
          <PencilLine size={14} />
        </button>
        <button 
          onClick={() => onDelete(entry.id)} 
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};