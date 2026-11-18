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
  /** Cover image, same as images[0]. */
  image: string;
};

/** What your server stores and returns. */
export type MenuItem = AddItemPayload & {
  _id: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
};