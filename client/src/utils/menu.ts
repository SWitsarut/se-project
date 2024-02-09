import {
  IconBook2,
  IconBooks,
  IconLayoutDashboard,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";

export const adminMenu = [
  { label: "Dashboard", link: "/admin", icon: IconLayoutDashboard },
  { label: "User management", link: "/admin/user-management", icon: IconUser },
];

export const publisherMenu = [
  { label: "Dashboard", link: "/publisher-admin", icon: IconLayoutDashboard },
  { label: "Manage books", link: "/publisher-admin/manage-books", icon: IconBook2 },
]

export const userMenu = [
  { label: "Profile", link: "/my-profile", icon: IconUserCircle },
  { label: "Bookshelf", link: "/my-bookshelf", icon: IconBooks },
];
