import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function EcommerceMetrics() {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const docs = querySnapshot.docs.map((doc) => doc.data());

        const total = querySnapshot.size;
        const active = docs.filter((u) => u.isActive === true).length;
        const inactive = total - active;

        setUserStats({
          total: total,
          active: active,
          inactive: inactive,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between gap-10">
        <div className="flex item-center gap-5">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800 ">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Users
              </span>
              <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {userStats.total.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-around border-t dark:border-gray-800 border-gray-100 pt-3 flex-wrap gap-3">
          <Badge color="success">
            <ArrowUpIcon />
            Active {userStats.active}
          </Badge>
          <Badge color="error">
            <ArrowDownIcon />
            Inactive {userStats.inactive}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between gap-10">
        <div className="flex item-center gap-5">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800 ">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className=" ">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Host
              </span>
              <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-around border-t dark:border-gray-800 border-gray-100 pt-3 flex-wrap gap-3">
          <Badge color="success">
            <ArrowUpIcon />
            Active {400}
          </Badge>
          <Badge color="error">
            <ArrowDownIcon />
            Active {100}
          </Badge>
        </div>
      </div>
    </div>
  );
}