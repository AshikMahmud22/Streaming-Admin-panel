import { PencilLine, X } from "lucide-react";
import { IdEntry } from "./IdEntryManager";
import { SVGAPreview } from "../Gifting/SVGAPreview";

interface IdEntryCardProps {
  entry: IdEntry;
  onEdit: (entry: IdEntry) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const IdEntryCard = ({ entry, onEdit, onDelete, isSelected, onSelect }: IdEntryCardProps) => {
  return (
    <div 
      onClick={onSelect}
      className={`group relative border md:w-50 rounded-3xl p-4 transition-all hover:shadow-xl bg-white dark:bg-gray-900 cursor-pointer ${
        isSelected ? "border-blue-500 ring-2 ring-blue-500/10" : "dark:border-gray-800"
      }`}
    >
      <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center overflow-hidden border dark:border-none">
        {entry.type === "png" ? (
          <img 
            src={entry.imageURL} 
            alt={entry.name} 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="w-full h-full">
            <SVGAPreview url={entry.imageURL} />
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-bold truncate dark:text-white text-black">
        {entry.name}
      </h3>
      <p className="text-[10px] text-gray-500 uppercase font-bold">
        {entry.subCategory || entry.category}
      </p>
      
      <div className={`absolute top-2 right-2 flex gap-1 transition-opacity z-10 ${
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(entry);
          }} 
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm text-blue-500 hover:scale-110 transition-transform border dark:border-gray-700"
        >
          <PencilLine size={14} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }} 
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform border dark:border-gray-700"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};