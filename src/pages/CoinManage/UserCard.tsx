import { Coins, User } from "lucide-react";
import { UserInfo } from "./CoinManager";

interface UserCardProps {
  user: UserInfo;
  isSelected: boolean;
  onSelect: (user: UserInfo) => void;
}

export const UserCard = ({ user, isSelected, onSelect }: UserCardProps) => {
  return (
    <div
      onClick={() => onSelect(user)}
      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-[1.02]"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <div className="relative shrink-0">
        {user.photoUrl ? (
          <img src={user.photoUrl} className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-blue-400" alt="" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            <User size={24} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm md:text-base dark:text-white truncate">{user.displayName}</h4>
        <p className="text-xs text-gray-500 font-medium truncate">ID: {user.displayId}</p>
        <p className="text-[10px] text-gray-400 truncate hidden sm:block">{user.email}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Coins size={14} className="text-orange-500" />
          <span className="text-sm font-black text-orange-600 dark:text-orange-400">{user.balance}</span>
        </div>
      </div>
    </div>
  );
};