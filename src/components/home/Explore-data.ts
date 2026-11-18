export type ExploreCategory = "Signature" | "Meat Lovers" | "Veggie";

export type ExplorePizza = {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: ExploreCategory;
  /** PNG (transparent background) inside /public/images/pizzas */
  image: string;
};

export const exploreCategories: ExploreCategory[] = [
  "Signature",
  "Meat Lovers",
  "Veggie",
];

export const explorePizzas: ExplorePizza[] = [
  // Signature
  {
    id: "margherita",
    name: "Classic Margherita",
    price: 9.5,
    rating: 4.8,
    category: "Signature",
    image: "/images/pizzas/margherita.png",
  },
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    price: 11.25,
    rating: 4.9,
    category: "Signature",
    image: "/images/pizzas/pepperoni.png",
  },
  {
    id: "four-cheese",
    name: "Four Cheese",
    price: 10.75,
    rating: 4.6,
    category: "Signature",
    image: "/images/pizzas/four-cheese.png",
  },

  // Meat Lovers
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    price: 12.5,
    rating: 4.7,
    category: "Meat Lovers",
    image: "/images/pizzas/bbq-chicken.png",
  },
  {
    id: "beef-supreme",
    name: "Beef Supreme",
    price: 13.25,
    rating: 4.8,
    category: "Meat Lovers",
    image: "/images/pizzas/beef-supreme.png",
  },
  {
    id: "spicy-sausage",
    name: "Spicy Sausage",
    price: 12.0,
    rating: 4.5,
    category: "Meat Lovers",
    image: "/images/pizzas/spicy-sausage.png",
  },

  // Veggie
  {
    id: "garden-fresh",
    name: "Garden Fresh",
    price: 9.75,
    rating: 4.6,
    category: "Veggie",
    image: "/images/pizzas/garden-fresh.png",
  },
  {
    id: "mushroom-melt",
    name: "Mushroom Melt",
    price: 10.5,
    rating: 4.7,
    category: "Veggie",
    image: "/images/pizzas/mushroom-melt.png",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    price: 11.0,
    rating: 4.8,
    category: "Veggie",
    image: "/images/pizzas/paneer-tikka.png",
  },
];