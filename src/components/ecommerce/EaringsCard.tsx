import { ArrowUpIcon } from "../../icons";
import { LiaCoinsSolid } from "react-icons/lia";
import { IoWalletOutline } from "react-icons/io5";


export default function DemographicCard() {
  return (
    <div className="grid grid-cols-6 gap-5 grid-wrap">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 col-span-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  flex flex-col justify-between gap-10">
        <div className="flex item-center gap-5 flex-wrap">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800 ">
            <LiaCoinsSolid  className="text-yellow-400 size-6 dark:text-yellow-400" />
          </div>

          <div className=" ">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Coin Generate
              </span>
              <h4 className="  text-yellow-500 ">454,654,616,316</h4>
            </div>
          </div>
        </div>
        <div className="flex justify-around flex-wrap border-t dark:border-gray-800 border-gray-100 pt-3">
          <p className="flex items-center text-green-500">
            <span>
              <ArrowUpIcon />
            </span>
            15% 
          </p>
          <p className="text-gray-400 ml-2">from yesterday</p>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 col-span-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  flex flex-col justify-between gap-10">
        <div className="flex item-center gap-5 flex-wrap">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800 ">
            <IoWalletOutline  className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className=" ">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Earings
              </span>
              <h4 className=" dark:text-white ">454,654,616,316 $</h4>
            </div>
          </div>
        </div>
        <div className="flex justify-around flex-wrap border-t dark:border-gray-800 border-gray-100 pt-3">
          <p className="flex items-center text-green-500">
            <span>
              <ArrowUpIcon />
            </span>
            15% 
          </p>
          <p className="text-gray-400 ml-2">from yesterday</p>
        </div>
      </div>
    </div>
  );
}
