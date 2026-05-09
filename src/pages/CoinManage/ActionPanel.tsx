import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { ArrowUpRight, RotateCcw, X, Coins } from "lucide-react";
import toast from "react-hot-toast";
import { UserInfo } from "./CoinManager";

interface ActionPanelProps {
  selectedUser: UserInfo | null;
  onClose: () => void;
}

export const ActionPanel = ({ selectedUser, onClose }: ActionPanelProps) => {
  const [amount, setAmount] = useState<number>(0);

  const handleUpdateBalance = async (type: "add" | "clear") => {
    if (!selectedUser?.uid) {
      toast.error("No user selected");
      return;
    }

    if (type === "add" && amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const tid = toast.loading("Processing...");

    try {
      const userRef = doc(db, "users", selectedUser.uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const currentBalance = userSnap.exists()
          ? (userSnap.data().balance ?? 0)
          : 0;

        const newBalance =
          type === "clear" ? 0 : currentBalance + amount;

        if (userSnap.exists()) {
          transaction.update(userRef, { balance: newBalance });
        } else {
          transaction.set(userRef, { balance: newBalance }, { merge: true });
        }
      });

      if (type === "clear") {
        toast.success("Balance cleared", { id: tid });
      } else {
        toast.success(`Added ${amount} coins successfully`, { id: tid });
      }

      setAmount(0);
      onClose();
    } catch (error) {
      console.error("Coin update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Action failed",
        { id: tid }
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-6 md:p-8 shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black dark:text-white tracking-tight">Modify Balance</h3>
        <button
          onClick={onClose}
          className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center gap-4">
          {selectedUser?.photoUrl ? (
            <img
              src={selectedUser.photoUrl}
              className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
              alt=""
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xl font-bold shrink-0">
              {selectedUser?.displayName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Selected Account</p>
            <p className="text-lg font-bold dark:text-white truncate">{selectedUser?.displayName}</p>
            <p className="text-xs text-gray-500 font-medium">
              Currently has{" "}
              <span className="text-orange-500 font-bold">
                {selectedUser?.balance ?? 0}
              </span>{" "}
              Coins
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Top-up Coins
          </label>
          <div className="relative mt-2">
            <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={24} />
            <input
              type="number"
              min={1}
              placeholder="0"
              className="w-full pl-12 p-5 rounded-2xl border dark:border-gray-800 bg-transparent dark:text-white text-3xl font-bold outline-none focus:ring-2 ring-blue-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
              value={amount === 0 ? "" : amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? 0 : Number(e.target.value))
              }
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          <button
            onClick={() => handleUpdateBalance("add")}
            className="w-full py-5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            Confirm Add <ArrowUpRight size={22} />
          </button>
          <button
            onClick={() => handleUpdateBalance("clear")}
            className="w-full py-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-[0.98]"
          >
            Reset to 00 <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};