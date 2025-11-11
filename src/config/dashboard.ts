import {
  ChartBarStacked,
  Command,
  FileText,
  Inbox,
  LineChart,
  Package,
  ShoppingBasket,
  ShoppingCart,
  Users2,
  Newspaper,
  ListTree,
  TagIcon,
  Image as ImageIcon
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
  ShoppingBasket,
  logo: Command,
  Newspaper,
  ListTree,
  TagIcon,
  ImageIcon,
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
    title: 'Sub Category',
    url: '/dashboard/sub-categories',
    icon: 'Package',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Product',
    url: '/dashboard/products',
    icon: 'ShoppingBasket',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Posts Category',
    url: '/dashboard/postCategories',
    icon: 'ListTree',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Posts',
    url: '/dashboard/posts',
    icon: 'Newspaper',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Brands',
    url: '/dashboard/brands',
    icon: 'TagIcon',
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Banners',
    url: '/dashboard/banners',
    icon: 'ImageIcon',
    isActive: false,
    items: [], // No child items
  },
];

export const pathName = {
  dashboard: '/dashboard',
  auth: '/dashboard/auth',
  categories: '/dashboard/categories',
  subCategories: '/dashboard/sub-categories',
  products: '/dashboard/products',
  postCategories: '/dashboard/postCategories',
  posts: '/dashboard/posts',
  brands: '/dashboard/brands',
  banners: '/dashboard/banners',
};
