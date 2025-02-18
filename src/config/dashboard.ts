import {
  ChartBarStacked,
  Command,
  FileText,
  Inbox,
  LineChart,
  Package,
  ShoppingCart,
  Users2,
} from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  icon: keyof typeof iconComponents;
  items: NavItem[];
  isActive?: boolean;
}

export const iconComponents = {
  Inbox,
  ShoppingCart,
  FileText,
  Package,
  Users2,
  LineChart,
  ChartBarStacked,
  logo: Command,
};

export const navConfig = [
  {
    title: 'Category',
    url: '/dashboard/categories',
    icon: 'ChartBarStacked',
    isActive: false,
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'Package',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'Package',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'Package',
      },
      {
        title: 'Login',
        url: '/',
        icon: 'Package',
      },
    ],
  },
];

export const pathName = {
  dashboard: '/dashboard',
  auth: '/dashboard/auth',
  categories: '/dashboard/categories',
  analytics: '/dashboard/analytics',
};
