import {
  IconBook2,
  IconBooks,
  IconCopyright,
  IconLayoutDashboard,
  IconUser,
  IconUserCircle,
  IconHeart,
} from "@tabler/icons-react";

export const adminMenu = [
  { label: "Dashboard", link: "/admin/dashboard", icon: IconLayoutDashboard },
  { label: "Chat", link: "/admin/chat", icon: IconCopyright },
  { label: "Book management", link: "/admin/book-management", icon: IconBook2 },
  { label: "User management", link: "/admin/user-management", icon: IconUser },
  { label: "Publisher management", link: "/admin/publisher-management", icon: IconCopyright },
];

export const publisherMenu = [
  { label: "Dashboard", link: "/publisher/dashboard", icon: IconLayoutDashboard },
  { label: "Book management", link: "/publisher/book-management", icon: IconBook2 },
  { label: "Staff management", link: "/publisher/staff-management", icon: IconUser },
];

export const userMenu = [
  { label: "Profile", link: "/my-profile", icon: IconUserCircle },
  { label: "Bookshelf", link: "/my-bookshelf", icon: IconBooks },
  { label: "Wishlists", link: "/my-wishlists", icon: IconHeart },
];
