export interface User {
  created_at: string | null;
  email: string | null | undefined;
  email_verified: string | null;
  id: string;
  image: string | null;
  name: string | null;
  stripe_current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string /* primary key */;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  slug?: string;
}

export interface subCategory {
  id: string /* primary key */;
  name: string;
  category_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface Product {
  id: string /* primary key */;
  productName: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  slug?: string;
  quantity: number;
  productType: Record<string, any>;
  price: number;
  oldPrice: number;
  categoryId: string;
  brandId: string | null;
  specs: Record<string, any>[]
  media: string[]
}

export interface Post {
  author_id: string | null
  category_id: string | null
  content: string | null
  created_at: string | null
  id: string
  published_at: string | null
  slug: string
  status: string | null
  thumbnail_url: string | null
  title: string
  updated_at: string | null
}

export interface PostCategory {
  id: string /* primary key */;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  slug?: string;
}

export interface Brand {
  id: string /* primary key */;
  name: string;
  description: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string | null;
  slug?: string;
}

export interface Banner {
  id: string /* primary key */;
  title: string;
  type: 'single' | 'grid';
  images: {
    src: string;
    alt?: string;
    linkProduct?: string | null; // Product slug for this specific image
  }[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string | null;
}