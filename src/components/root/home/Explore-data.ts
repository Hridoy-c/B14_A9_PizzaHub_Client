import { PIZZA_CATEGORIES } from "@/lib/types/menu-item";

/** Category labels shared with the vendor "add item" form. */
export type ExploreCategory = (typeof PIZZA_CATEGORIES)[number]["label"];

export type ExplorePizza = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: ExploreCategory;
  /** WebP photo (1200x900) inside /public/images. */
  image?: string;
  /** Emoji fallback shown when no photo is available. */
  emoji?: string;
};

export const exploreCategories: ExploreCategory[] = PIZZA_CATEGORIES.map(
  (category) => category.label
);

/** Anchor used by the /menu page, e.g. "#meat-lovers". */
export const categorySlug = (category: ExploreCategory) =>
  PIZZA_CATEGORIES.find((item) => item.label === category)?.value ??
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const explorePizzas: ExplorePizza[] = [
  // Classic Pizzas
  {
    id: "margherita",
    name: "Classic Margherita",
    description:
      "Hand-stretched dough, San Marzano tomato sauce, fresh mozzarella and basil.",
    price: 9.5,
    rating: 4.8,
    category: "Classic Pizzas",
    image: "/images/pizzas/margherita.webp",
  },
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    description:
      "A double layer of spicy pepperoni over molten mozzarella and tomato.",
    price: 11.25,
    rating: 4.9,
    category: "Classic Pizzas",
    image: "/images/pizzas/pepperoni.webp",
  },
  {
    id: "four-cheese",
    name: "Four Cheese",
    description:
      "Mozzarella, gorgonzola, fontina and parmesan melted into one golden crust.",
    price: 10.75,
    rating: 4.6,
    category: "Classic Pizzas",
    image: "/images/pizzas/four-cheese.webp",
  },

  // Vegetarian Pizzas
  {
    id: "garden-fresh",
    name: "Garden Fresh",
    description:
      "Roasted peppers, cherry tomatoes, red onion and olives on a light tomato base.",
    price: 10.95,
    rating: 4.6,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/garden-fresh.webp",
  },
  {
    id: "mushroom-melt",
    name: "Mushroom Melt",
    description:
      "Garlic-buttered mushrooms, thyme and a generous blanket of mozzarella.",
    price: 11.5,
    rating: 4.7,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/mushroom-melt.webp",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description:
      "Tandoori-spiced paneer, capsicum, onion and a swirl of mint yoghurt.",
    price: 12.25,
    rating: 4.8,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/paneer-tikka.webp",
  },
  {
    id: "mediterranean",
    name: "Mediterranean Veg",
    description:
      "Sun-dried tomatoes, artichoke, feta and oregano on a crisp olive-oil base.",
    price: 11.95,
    rating: 4.5,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/mediterranean.webp",
  },
  {
    id: "spinach-feta",
    name: "Spinach & Feta",
    description:
      "Wilted spinach, crumbled feta and toasted garlic with a hint of lemon.",
    price: 11.75,
    rating: 4.6,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/spinach-feta.webp",
  },
  {
    id: "corn-jalapeno",
    name: "Corn & Jalapeño",
    description:
      "Sweetcorn, pickled jalapeño and mozzarella with a chilli-honey drizzle.",
    price: 10.25,
    rating: 4.4,
    category: "Vegetarian Pizzas",
    image: "/images/pizzas/corn-jalapeno.webp",
  },

  // Meat Lovers
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description:
      "Smoky barbecue chicken, red onion and coriander over a tangy BBQ base.",
    price: 12.5,
    rating: 4.7,
    category: "Meat Lovers",
    image: "/images/pizzas/bbq-chicken.webp",
  },
  {
    id: "beef-supreme",
    name: "Beef Supreme",
    description:
      "Seasoned beef, pepperoni, capsicum and black olives with extra mozzarella.",
    price: 13.25,
    rating: 4.8,
    category: "Meat Lovers",
    image: "/images/pizzas/beef-supreme.webp",
  },
  {
    id: "spicy-sausage",
    name: "Spicy Sausage",
    description:
      "Italian sausage, chilli flakes and roasted peppers on a rich tomato base.",
    price: 11.75,
    rating: 4.5,
    category: "Meat Lovers",
    image: "/images/pizzas/spicy-sausage.webp",
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers Supreme",
    description:
      "Pepperoni, beef, ham and bacon piled high with a triple-cheese blend.",
    price: 14.75,
    rating: 4.9,
    category: "Meat Lovers",
    image: "/images/pizzas/meat-lovers.webp",
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    description:
      "Marinated tikka chicken, red onion and coriander with a cool yoghurt swirl.",
    price: 12.95,
    rating: 4.6,
    category: "Meat Lovers",
    image: "/images/pizzas/chicken-tikka.webp",
  },
  {
    id: "bacon-ham",
    name: "Smoky Bacon & Ham",
    description:
      "Smoked bacon, honey-roast ham and caramelised onion with mozzarella.",
    price: 12.25,
    rating: 4.5,
    category: "Meat Lovers",
    image: "/images/pizzas/bacon-ham.webp",
  },

  // Specialty / Gourmet Pizzas
  {
    id: "prosciutto-arugula",
    name: "Prosciutto & Arugula",
    description:
      "Thin-sliced prosciutto, peppery arugula and shaved parmesan on a white base.",
    price: 13.5,
    rating: 4.7,
    category: "Specialty / Gourmet Pizzas",
    image: "/images/pizzas/prosciutto-arugula.webp",
  },
  {
    id: "quattro-stagioni",
    name: "Quattro Stagioni",
    description:
      "Four seasons in one pizza: artichoke, ham, mushroom and black olives.",
    price: 12.75,
    rating: 4.6,
    category: "Specialty / Gourmet Pizzas",
    image: "/images/pizzas/quattro-stagioni.webp",
  },
  {
    id: "truffle-bianca",
    name: "Truffle Bianca",
    description:
      "Black truffle cream, wild mushrooms and parmesan shavings, finished with thyme.",
    price: 14.25,
    rating: 4.8,
    category: "Specialty / Gourmet Pizzas",
    image: "/images/pizzas/truffle-bianca.webp",
  },

  // Sides & Appetizers (dummy data — emoji tiles until photos arrive)
  {
    id: "garlic-bread",
    name: "Garlic Bread",
    description:
      "Stone-baked garlic butter bread finished with parsley and parmesan.",
    price: 4.5,
    rating: 4.7,
    category: "Sides & Appetizers",
    emoji: "🥖",
  },
  {
    id: "mozzarella-sticks",
    name: "Mozzarella Sticks",
    description:
      "Golden crumbed mozzarella with a stretchy centre and marinara dip.",
    price: 5.75,
    rating: 4.6,
    category: "Sides & Appetizers",
    emoji: "🧀",
  },
  {
    id: "peri-peri-wings",
    name: "Peri-Peri Wings",
    description:
      "Six oven-roasted wings tossed in a smoky peri-peri glaze.",
    price: 7.95,
    rating: 4.8,
    category: "Sides & Appetizers",
    emoji: "🍗",
  },

  // Beverages & Desserts (dummy data — emoji tiles until photos arrive)
  {
    id: "classic-cola",
    name: "Classic Cola",
    description: "Ice-cold cola, served in a 330ml can.",
    price: 2.5,
    rating: 4.5,
    category: "Beverages & Desserts",
    emoji: "🥤",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description:
      "Espresso-soaked sponge layered with mascarpone cream and cocoa.",
    price: 5.5,
    rating: 4.9,
    category: "Beverages & Desserts",
    emoji: "🍰",
  },
  {
    id: "fresh-lemonade",
    name: "Fresh Lemonade",
    description: "House-squeezed lemonade with mint and a little honey.",
    price: 3.25,
    rating: 4.6,
    category: "Beverages & Desserts",
    emoji: "🍋",
  },
];
