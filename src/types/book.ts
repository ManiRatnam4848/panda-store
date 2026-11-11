export type BookCategory = 
  | 'Fiction'
  | 'Nonfiction'
  | 'Art & Architecture'
  | 'Philosophy'
  | 'Science & Nature'
  | 'Poetry & Essays'
  | 'Children & Young Adult';

export type BookFormat = 'Hardcover' | 'Paperback' | 'Collector\'s Edition';

export interface BookReview {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  coverImage: string;
  coverBgColor: string;
  coverTextColor: string;
  accentColor: string;
  spineColor: string;
  price: number; // in INR
  originalPrice?: number; // for discount display
  rating: number;
  reviewCount: number;
  category: BookCategory;
  format: BookFormat;
  formatsAvailable: {
    format: BookFormat;
    price: number;
    inStock: boolean;
  }[];
  description: string;
  excerpt: string;
  pages: number;
  isbn: string;
  language: string;
  publishedYear: number;
  publisher: string;
  dimensions: string;
  weight: string;
  inStock: boolean;
  stockCount: number;
  bestseller?: boolean;
  newArrival?: boolean;
  readersFavourite?: boolean;
  hiddenGem?: boolean;
  featuredStory?: boolean;
  reviews: BookReview[];
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: BookFormat;
  selectedPrice: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  customer: CustomerAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'Cash on Delivery';
  paymentDetails?: string;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  estimatedDeliveryDate: string;
}
