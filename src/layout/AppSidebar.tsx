import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, Users, Gift, Smile, Image as ImageIcon, 
  ShoppingBag, Coins, TrendingUp, Mic, ShieldAlert, 
  Building2, MessageSquare, Palette, Settings, Gamepad2, FileText
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/" },
  { 
    name: "User Management", icon: <Users />,
    subItems: [
      { name: "User List", path: "/users" },
      { name: "Blocked Users", path: "/blocked-users" }
    ]
  },
  { 
    name: "Content Store", icon: <ShoppingBag />,
    subItems: [
      { name: "Gifting", path: "/gifting" },
      { name: "Emojis", path: "/emojis" },
      { name: "Frames", path: "/frames" },
      { name: "ID Entry", path: "/id-entry" }
    ]
  },
  { 
    name: "Live Controls", icon: <Mic />,
    subItems: [
      { name: "Audio Board", path: "/audio-board" },
      { name: "Video Board", path: "/video-board" },
      { name: "Room Skins", path: "/room-skins" }
    ]
  },
  { 
    name: "Agency & Support", icon: <Building2 />,
    subItems: [
      { name: "Agency List", path: "/agencies" },
      { name: "Host Approvals", path: "/host-approvals" },
      { name: "Support Tickets", path: "/support" }
    ]
  },
  { name: "Coin & Earnings", icon: <Coins />, path: "/earnings" },
  { name: "Game Control", icon: <Gamepad2 />, path: "/games" },
  { 
    name: "System Settings", icon: <Settings />,
    subItems: [
      { name: "Theme Upload", path: "/theme-upload" },
      { name: "About Us", path: "/about-us" },
      { name: "Password Mgt", path: "/security" }
    ]
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
        {(isExpanded || isHovered || isMobileOpen) && <span className="font-bold text-xl dark:text-white">AdminPanel</span>}
      </div>

      <nav className="px-4 py-4 overflow-y-auto h-[calc(100vh-100px)] no-scrollbar">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <button
                  onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${openSubmenu === item.name ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.name}</span>
                      <span className="text-xs">▼</span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isActive(item.path || "") ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && <span className="font-medium">{item.name}</span>}
                </Link>
              )}

              {item.subItems && (isExpanded || isHovered || isMobileOpen) && openSubmenu === item.name && (
                <ul className="pl-12 mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link to={sub.path} className={`block p-2 text-sm rounded-lg ${isActive(sub.path) ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}>
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