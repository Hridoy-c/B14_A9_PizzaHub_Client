export type ExploreCategory = "Signature" | "Meat Lovers" | "Veggie";

export type ExplorePizza = {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: ExploreCategory;
  /** WebP photo (1200x900) inside /public/images/pizzas */
  image: string;
};

export const exploreCategories: ExploreCategory[] = [
  "Signature",
  "Meat Lovers",
  "Veggie",
];

/** Anchor used by the /menu page, e.g. "#meat-lovers". */
export const categorySlug = (category: ExploreCategory) =>
  category.toLowerCase().replace(/\s+/g, "-");

export const explorePizzas: ExplorePizza[] = [
  // Signature
  {
    id: "margherita",
    name: "Classic Margherita",
    price: 9.5,
    rating: 4.8,
    category: "Signature",
    image: "/images/pizzas/margherita.webp",
  },
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    price: 11.25,
    rating: 4.9,
    category: "Signature",
    image: "/images/pizzas/pepperoni.webp",
  },
  {
    id: "four-cheese",
    name: "Four Cheese",
    price: 10.75,
    rating: 4.6,
    category: "Signature",
    image: "/images/pizzas/four-cheese.webp",
  },
  {
    id: "prosciutto-arugula",
    name: "Prosciutto & Arugula",
    price: 13.5,
    rating: 4.7,
    category: "Signature",
    image: "/images/pizzas/prosciutto-arugula.webp",
  },
  {
    id: "quattro-stagioni",
    name: "Quattro Stagioni",
    price: 12.75,
    rating: 4.6,
    category: "Signature",
    image: "/images/pizzas/quattro-stagioni.webp",
  },
  {
    id: "truffle-bianca",
    name: "Truffle Bianca",
    price: 14.25,
    rating: 4.8,
    category: "Signature",
    image: "/images/pizzas/truffle-bianca.webp",
  },

  // Meat Lovers
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    price: 12.5,
    rating: 4.7,
    category: "Meat Lovers",
    image: "/images/pizzas/bbq-chicken.webp",
  },
  {
    id: "beef-supreme",
    name: "Beef Supreme",
    price: 13.25,
    rating: 4.8,
    category: "Meat Lovers",
    image: "/images/pizzas/beef-supreme.webp",
  },
  {
    id: "spicy-sausage",
    name: "Spicy Sausage",
    price: 11.75,
    rating: 4.5,
    category: "Meat Lovers",
    image: "/images/pizzas/spicy-sausage.webp",
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers Supreme",
    price: 14.75,
    rating: 4.9,
    category: "Meat Lovers",
    image: "/images/pizzas/meat-lovers.webp",
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    price: 12.95,
    rating: 4.6,
    category: "Meat Lovers",
    image: "/images/pizzas/chicken-tikka.webp",
  },
  {
    id: "bacon-ham",
    name: "Smoky Bacon & Ham",
    price: 12.25,
    rating: 4.5,
    category: "Meat Lovers",
    image: "/images/pizzas/bacon-ham.webp",
  },

  // Veggie
  {
    id: "garden-fresh",
    name: "Garden Fresh",
    price: 10.95,
    rating: 4.6,
    category: "Veggie",
    image: "/images/pizzas/garden-fresh.webp",
  },
  {
    id: "mushroom-melt",
    name: "Mushroom Melt",
    price: 11.5,
    rating: 4.7,
    category: "Veggie",
    image: "/images/pizzas/mushroom-melt.webp",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    price: 12.25,
    rating: 4.8,
    category: "Veggie",
    image: "/images/pizzas/paneer-tikka.webp",
  },
  {
    id: "mediterranean",
    name: "Mediterranean Veg",
    price: 11.95,
    rating: 4.5,
    category: "Veggie",
    image: "/images/pizzas/mediterranean.webp",
  },
  {
    id: "spinach-feta",
    name: "Spinach & Feta",
    price: 11.75,
    rating: 4.6,
    category: "Veggie",
    image: "/images/pizzas/spinach-feta.webp",
  },
  {
    id: "corn-jalapeno",
    name: "Corn & Jalapeño",
    price: 10.25,
    rating: 4.4,
    category: "Veggie",
    image: "/images/pizzas/corn-jalapeno.webp",
  },
];
