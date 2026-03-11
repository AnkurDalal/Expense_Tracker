import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut
} from "react-icons/lu";
import { FiBarChart2 } from "react-icons/fi";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard"
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income"
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense"
  },
  {
    id: "04",
    label: "Reports",
    icon: FiBarChart2,
    path: "/reports"
  }
];