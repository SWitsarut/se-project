import { IconBooks, IconLayoutDashboard, IconUser, IconUserCircle } from "@tabler/icons-react";

export const adminMenu = [
  { label: "Dashboard", link: "/admin", icon: IconLayoutDashboard },
  { label: "User management", link: "/admin/user-management", icon: IconUser },
]

export const userMenu = [
  { label: "Profile", link: "/my-profile", icon: IconUserCircle },
  { label: "Bookshelf", link: "/my-book-shelf", icon: IconBooks }
]