import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Pagination } from "../../components/Pagination/Pagination";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.includes(search) ||
      u.displayId?.includes(search);
    const matchesFilter =
      filter === "All" || (filter === "Active" ? u.isActive : !u.isActive);
    return matchesSearch && matchesFilter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:text-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="border dark:border-gray-800 p-2 rounded-lg bg-transparent"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-pointer"
          onChange={(e) => {
            setFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option className=" " value="All">All Status</option>
          <option className=" " value="Active">Active</option>
          <option className=" " value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-y dark:border-gray-800">
                <TableCell className="py-3 text-start pl-10" isHeader>User</TableCell>
                <TableCell className="py-3 pl-3 text-start" isHeader>Email</TableCell>
                <TableCell className="py-3 pl-3 text-start" isHeader>UID</TableCell>
                <TableCell className="py-3 pl-3" isHeader>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow className="border-y dark:border-gray-800" key={user.id}>
                  <TableCell className="py-2 text-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoUrl || "/default-avatar.png"}
                        alt={user.displayName}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.displayName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pl-3">{user.email}</TableCell>
                  <TableCell className="py-3 pl-3">{user.displayId}</TableCell>
                  <TableCell className="py-3 pl-3 text-center">
                    <Badge color={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}