import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Gift,
  Smile,
  Image as ImageIcon,
  ShoppingBag,
  Coins,
  TrendingUp,
  Mic,
  ShieldAlert,
  Building2,
  MessageSquare,
  Palette,
  Settings,
  Gamepad2,
  FileText,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { LuSquareDashedKanban } from "react-icons/lu";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
  {
    name: "User Management",
    icon: <Users size={22} />,
    subItems: [
      { name: "User List", path: "/users", icon: <Users size={18} /> },
      // { name: "Blocked Users", path: "/blocked-users" }
    ],
  },
  {
    name: "Content Store",
    icon: <ShoppingBag size={22} />,
    subItems: [
      { name: "Gift", path: "/gifts", icon: <Gift size={18} /> },
      { name: "Emojis", path: "/emojis", icon: <Smile size={18} /> },
      { name: "Frames", path: "/frames", icon: <ImageIcon size={18} /> },
      { name: "ID Entry", path: "/id-entry", icon: <TrendingUp size={18} /> },
    ],
  },
  {
    name: "Live Controls",
    icon: <Mic size={22} />,
    subItems: [
      { name: "Audio Board", path: "/audio-board", icon: <Mic size={18} /> },
      { name: "Video Board", path: "/video-board", icon: <ImageIcon size={18} /> },
      { name: "Room Skins", path: "/room-skins", icon: <Palette size={18} /> },
    ],
  },
  {
    name: "Agency & Support",
    icon: <Building2 size={22} />,
    subItems: [
      { name: "Agency List", path: "/agencies", icon: <Building2 size={18} /> },
      { name: "Host Approvals", path: "/host-approvals", icon: <Users size={18} /> },
      { name: "Support Tickets", path: "/support", icon: <MessageSquare size={18} /> },
    ],
  },
  { name: "Coin & Earnings", icon: <Coins size={22} />, path: "/earnings" },
  { name: "Game Control", icon: <Gamepad2 size={22} />, path: "/games" },
  {
    name: "System Settings",
    icon: <Settings size={22} />,
    subItems: [
      { name: "Theme Upload", path: "/theme-upload", icon: <Palette size={18} /> },
      { name: "About Us", path: "/about-us", icon: <FileText size={18} /> },
      { name: "Password Mgt", path: "/security", icon: <ShieldAlert size={18} /> },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0  h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center rotate-180 justify-center text-white font-bold">
          {" "}
          <LuSquareDashedKanban size={24} />
        </div>
        {(isExpanded || isHovered || isMobileOpen) && (
          <span className="font-bold text-xl dark:text-white">AdminPanel</span>
        )}
      </div>

      <nav className="px-4 py-4 overflow-y-auto h-[calc(100vh-100px)] no-scrollbar">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <button
                  onClick={() =>
                    setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                  }
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${openSubmenu === item.name ? "bg-blue-200 text-blue-600" : "text-gray-500 hover:bg-blue-100"}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <>
                      <span className="flex-1 text-left font-medium">
                        {item.name}
                      </span>
                      <span className="text-xs">▼</span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isActive(item.path || "") ? "bg-blue-950 text-white" : "text-gray-500 hover:bg-blue-100"}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              )}

              {item.subItems &&
                (isExpanded || isHovered || isMobileOpen) &&
                openSubmenu === item.name && (
                  <ul className="pl-12 mt-1 space-y-1">
                    {item.subItems.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          to={sub.path}
                          className={`flex items-center gap-3 p-2 text-sm rounded-lg ${isActive(sub.path) ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          {sub.icon && <span className="shrink-0">{sub.icon}</span>}
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
