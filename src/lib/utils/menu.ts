import { PIZZA_CATEGORIES, type CardPizza, type MenuItem } from "@/lib/types";

/** Maps a stored category slug ("classic") to its display label. */
export const categoryLabel = (value: string) =>
  PIZZA_CATEGORIES.find((category) => category.value === value)?.label ?? value;

/** Shapes a database item into the data `PizzaCard` renders. */
export const toCardPizza = (item: MenuItem): CardPizza => ({
  id: String(item._id),
  name: item.name,
  price: item.price,
  image: item.image ?? item.images?.[0] ?? "",
  description: item.description,
  category: categoryLabel(item.category),
  location: item.location,
  vendorName: item.vendorName,
  vendorPremium: Boolean(item.vendorPremium),
});
