import React from "react";
import { UserX, Trash2, Loader2, Phone } from "lucide-react";
import { AdminData } from "./AdminManagement";
import { ROLES } from "../../routes/ProtectedRoute";

interface AdminTableProps {
  admins: AdminData[];
  loading: boolean;
  handleStatusToggle: (id: string, status: boolean) => void;
  handleRoleChange: (id: string, role: string) => void;
  handleDeleteAdmin: (id: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  loading,
  handleStatusToggle,
  handleRoleChange,
  handleDeleteAdmin,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Admin Info
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Role
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Status
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center dark:text-white">
                  <Loader2 className="animate-spin inline mr-2" /> Loading...
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800 dark:text-white whitespace-nowrap">
                      {admin.name}
                    </p>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {admin.email}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-semibold whitespace-nowrap">
                      <Phone size={12} /> {admin.phone}
                    </p>
                  </td>
                  <td className="p-4">
                    <select
                      value={admin.role}
                      disabled={admin.role === ROLES.MOTHER}
                      onChange={(e) =>
                        handleRoleChange(admin.id, e.target.value)
                      }
                      className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded p-1 outline-none bg-transparent"
                    >
                      <option value={ROLES.ADMIN}>Admin</option>
                      <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                      <option value={ROLES.AGENCY}>Agency</option>
                      <option value={ROLES.RESELLER}>Reseller</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        admin.isActive
                          ? "border dark:border-gray-700 text-green-500"
                          : "border dark:border-gray-700 text-red-500"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Banned"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          handleStatusToggle(admin.id, admin.isActive)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          admin.isActive
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        <UserX size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
