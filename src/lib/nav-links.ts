import { Bean, ChartCandlestick, DollarSign, Map, Users } from "lucide-react";

export const NavDashboard = {
  header: {
    title: "Dashboard",
    image: undefined,
    href: "/",
    icon: undefined,
    isActive: false,
    role: undefined,
    items: undefined,
  },
  main: [
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      isActive: false,
      role: ["admin"],
      items: undefined,
    },
    {
      title: "Countries",
      href: "/dashboard/countries",
      icon: Map,
      isActive: false,
      role: undefined,
      items: undefined,
    },
    {
      title: "Foods",
      href: "/dashboard/foods",
      icon: Bean,
      isActive: false,
      role: undefined,
      items: undefined,
    },
    {
      title: "Food Prices",
      href: "/dashboard/food-prices",
      icon: DollarSign,
      isActive: false,
      role: undefined,
      items: undefined,
    },
    {
      title: "Food Price Inflations",
      href: "/dashboard/food-price-inflations",
      icon: ChartCandlestick,
      isActive: false,
      role: undefined,
      items: undefined,
    },
  ],
};
