export const PIZZA_CATEGORIES = [
  { value: "classic", label: "Classic Pizzas" },
  { value: "vegetarian", label: "Vegetarian Pizzas" },
  { value: "meat-lovers", label: "Meat Lovers" },
  { value: "specialty", label: "Specialty / Gourmet Pizzas" },
  { value: "sides", label: "Sides & Appetizers" },
  { value: "beverages-desserts", label: "Beverages & Desserts" },
] as const;

export type PizzaCategory = (typeof PIZZA_CATEGORIES)[number]["value"];

/** Raw form state: every input is a string until validated. */
export type AddItemFormState = {
  name: string;
  category: PizzaCategory | "";
  description: string;
  price: string;
  location: string;
  images: string[];
};

/** What you send to your API after validation. */
export type AddItemPayload = {
  name: string;
  category: PizzaCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  image: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorImage?: string | null;
  /** নতুন আইটেম সবসময় "pending" দিয়ে শুরু হয়, admin approve করলে "approved" হয়। */
  status: MenuItemStatus;
};

/** What your server stores and returns. */
export type MenuItem = AddItemPayload & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  /** Added by the API: the vendor currently has an active premium plan. */
  vendorPremium?: boolean;
};

/**
 * The subset of a pizza that `PizzaCard` renders. Database items
 * (`MenuItem`) are mapped to this shape by `toCardPizza`.
 */
export type CardPizza = {
  id: string;
  name: string;
  price: number;
  image?: string;
  /** Shown only when present — vendor items have no rating yet. */
  rating?: number;
  description?: string;
  /** Display label, e.g. "Classic Pizzas". */
  category?: string;
  emoji?: string;
  /** Restaurant area / city shown on cards. */
  location?: string;
  /** Restaurant name shown on cards. */
  vendorName?: string;
  /** Premium vendors get a badge and featured placement. */
  vendorPremium?: boolean;
};

export const MENU_ITEM_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "inactive",
] as const;

export type MenuItemStatus = (typeof MENU_ITEM_STATUSES)[number];



export const ORDER_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  /** Joined from `user` on the vendor orders endpoint. */
  customer?: { name: string; email: string; image?: string | null };
  /** Joined from menuItems; missing if the item was deleted. */
  item?: {
    name: string;
    image?: string;
    images?: string[];
    price: number;
    category: string;
    vendorName?: string;
  };
};


export type Transaction = {
  _id: string;
  sessionId: string;
  status: string;
  payment_status: string;
  customer_email?: string;
  userId: string;
  userName?: string;
  payment_date: string;
  payment_intent?: string;
  amount?: number;
  currency?: string;
    plan?: string;
  user?: { name?: string | null; email?: string; image?: string | null };
};