import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import AgencyModal from "./AgencyModal";

interface AgencyData {
  id: string;
  name: string;
  holderName: string;
  email: string;
  ownerId: string;
  logo: string;
  status: "active" | "blocked" | "pending";
  country: string;
}

export default function AgencyManager() {
  const [agencies, setAgencies] = useState<AgencyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "agencies"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AgencyData,
      );
      setAgencies(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await updateDoc(doc(db, "agencies", id), { status: newStatus });
      toast.success(`Agency ${newStatus}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          Delete this agency permanently?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(db, "agencies", id));
                toast.success("Agency deleted");
              } catch {
                toast.error("Delete failed");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-xs font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="min-h-screen p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 dark:text-white">
            <Building2 className="text-blue-500" size={32} /> Agency Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Global agency and owner management
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="  dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 sh active:scale-95 transition-all w-full md:w-auto justify-center border dark:border-gray-800"
        >
          <Plus size={20} /> Add New Agency
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-[32px] bg-white dark:bg-gray-900/40 shadow-sm">
        <table className="w-full text-left border-collapse text-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/60 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <th className="p-6">Agency & Logo</th>
              <th className="p-6">Owner Info</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {agencies.map((agency) => (
              <tr
                key={agency.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-15 h-15">
                      <img
                        src={agency.logo}
                        className="rounded-2xl object-cover ring-4 ring-gray-100 aspect-square dark:ring-gray-800 group-hover:ring-blue-500/30 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {agency.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {agency.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {agency.holderName}
                  </p>
                  <p className="text-xs text-blue-500 font-mono mt-0.5">
                    {agency.ownerId}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{agency.email}</p>
                </td>
                <td className="p-6">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                      agency.status === "active"
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                        : "bg-red-100 text-red-600 dark:bg-red-500/10"
                    }`}
                  >
                    {agency.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => navigate(`/agency/${agency.id}`)}
                      className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white rounded-2xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => toggleStatus(agency.id, agency.status)}
                      className={`p-3 rounded-2xl transition-all ${
                        agency.status === "active"
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                          : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      {agency.status === "active" ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => confirmDelete(agency.id)}
                      className="p-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-20 text-center text-gray-500 font-bold">
            Loading agencies...
          </div>
        )}
      </div>

      {isModalOpen && <AgencyModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}