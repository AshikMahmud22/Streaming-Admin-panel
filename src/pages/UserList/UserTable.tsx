import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  timeoutUntil?: Timestamp | null;
  displayId?: string;
}

interface UserTableProps {
  users: User[];
  getTimeoutDisplay: (timeoutUntil: Timestamp | null) => string | null;
  handleBlockToggle: (id: string, currentStatus: boolean) => void;
  cancelTimeout: (id: string) => void;
  openTimeoutModal: (id: string) => void;
}

export default function UserTable({
  users,
  getTimeoutDisplay,
  handleBlockToggle,
  cancelTimeout,
  openTimeoutModal,
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-y dark:border-gray-800">
          <TableCell className="py-3 text-start pl-10" isHeader>User</TableCell>
          <TableCell className="py-3 pl-3 text-start" isHeader>Email</TableCell>
          <TableCell className="py-3 text-center" isHeader>Status</TableCell>
          <TableCell className="py-3 text-center" isHeader>Time Left</TableCell>
          <TableCell className="py-3 text-center" isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const timeoutText = getTimeoutDisplay(user.timeoutUntil || null);
          return (
            <TableRow className="border-y dark:border-gray-800" key={user.id}>
              <TableCell className="py-2 pl-5">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoUrl || "/default-avatar.png"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <span className="font-medium text-gray-900 dark:text-white text-nowrap">
                    {user.displayName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400 pl-3">
                {user.email}
              </TableCell>
              <TableCell className="py-3 pl-3 text-nowrap text-center">
                {user.isBlocked ? (
                  <Badge color="error">Blocked</Badge>
                ) : timeoutText ? (
                  <Badge color="warning">On Timeout</Badge>
                ) : (
                  <Badge color={user.isActive ? "success" : "warning"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-3 font-mono text-xs text-nowrap text-orange-500 text-center px-3">
                {timeoutText || "-"}
              </TableCell>
              <TableCell className="py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleBlockToggle(user.id, user.isBlocked || false)}
                    className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                      user.isBlocked
                        ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>

                  {timeoutText ? (
                    <button
                      onClick={() => cancelTimeout(user.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => openTimeoutModal(user.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white dark:text-gray-300 transition-colors"
                    >
                      Timeout
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}