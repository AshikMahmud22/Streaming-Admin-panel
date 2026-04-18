import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Pagination } from "../../components/Pagination/Pagination";
import { collection, getDocs, query, orderBy, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive" | "Blocked" | "Timeout">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [timeoutMinutes, setTimeoutMinutes] = useState("");

  const usersPerPage = 10;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", id), { isBlocked: !currentStatus });
      fetchUsers(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openTimeoutModal = (id: string) => {
    setSelectedUser(id);
    setIsModalOpen(true);
  };

  const confirmTimeout = async () => {
    if (!selectedUser || !timeoutMinutes || isNaN(Number(timeoutMinutes))) return;

    const timeoutDate = new Date();
    timeoutDate.setMinutes(timeoutDate.getMinutes() + Number(timeoutMinutes));

    try {
      await updateDoc(doc(db, "users", selectedUser), {
        timeoutUntil: Timestamp.fromDate(timeoutDate),
      });
      setIsModalOpen(false);
      setTimeoutMinutes("");
      fetchUsers(false);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelTimeout = async (id: string) => {
    try {
      await updateDoc(doc(db, "users", id), {
        timeoutUntil: null,
      });
      fetchUsers(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeoutDisplay = (timeoutUntil: any) => {
    if (!timeoutUntil) return null;
    const target = timeoutUntil.toDate ? timeoutUntil.toDate() : new Date(timeoutUntil);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return null;

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${h > 0 ? h + "h " : ""}${m}m ${s}s`;
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.displayId?.includes(search);

    const isTimedOut = u.timeoutUntil && (u.timeoutUntil.toDate ? u.timeoutUntil.toDate() : new Date(u.timeoutUntil)) > now;

    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && u.isActive && !u.isBlocked && !isTimedOut) ||
      (filter === "Inactive" && !u.isActive) ||
      (filter === "Blocked" && u.isBlocked) ||
      (filter === "Timeout" && isTimedOut);

    return matchesSearch && matchesFilter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:text-white p-5 dark:border-gray-800 dark:bg-white/[0.03] relative">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="Search users..."
          className="border dark:border-gray-800 p-2 rounded-lg bg-transparent outline-none focus:ring-1 ring-blue-500 w-full md:w-80"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-pointer outline-none"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
          <option value="Timeout">Timeout</option>
        </select>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No {filter !== "All" ? filter.toLowerCase() : ""} users found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className=" ">
              <TableRow className="border-y dark:border-gray-800">
                <TableCell className="py-3  text-start pl-10" isHeader>User</TableCell>
                <TableCell className="py-3 pl-3 text-start" isHeader>Email</TableCell>
                <TableCell className="py-3 text-center" isHeader>Status</TableCell>
                <TableCell className="py-3 text-center" isHeader>Time Left</TableCell>
                <TableCell className="py-3 text-center" isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => {
                const timeoutText = getTimeoutDisplay(user.timeoutUntil);
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
                    <TableCell className="py-3 ">
                      <div className="flex justify-center gap-2 ">
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
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Set User Timeout</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the duration in minutes.</p>
            <input
              type="number"
              value={timeoutMinutes}
              onChange={(e) => setTimeoutMinutes(e.target.value)}
              placeholder="Minutes"
              className="w-full border dark:border-gray-800 p-3 rounded-xl bg-transparent outline-none focus:ring-2 ring-blue-500 mb-6 dark:text-white"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeoutMinutes("");
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmTimeout}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}