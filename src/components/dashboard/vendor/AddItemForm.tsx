"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ImagePlus, Loader2, MapPin } from "lucide-react";
import ImageUploader from "./ImageUploader";

/* ---------- Config ---------- */

const PIZZA_CATEGORIES = [
  { value: "classic", label: "Classic Pizzas" },
  { value: "vegetarian", label: "Vegetarian Pizzas" },
  { value: "meat-lovers", label: "Meat Lovers" },
  { value: "specialty", label: "Specialty / Gourmet Pizzas" },
  { value: "sides", label: "Sides & Appetizers" },
  { value: "beverages-desserts", label: "Beverages & Desserts" },
] as const;

const MAX_DESCRIPTION = 400;

/* ---------- Shared styles ---------- */

const cardClass =
  "rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5 sm:p-7";
const cardTitleClass =
  "font-display text-[1.625rem] leading-none tracking-tight text-[#3B2417]";
const cardHintClass = "mt-2 text-[0.9375rem] leading-relaxed text-[#7A6455]";
const labelClass = "font-sans text-[0.9375rem] text-[#3B2417]";
const fieldClass =
  "h-12 w-full rounded-xl border border-[#EADBC8] bg-white px-4 text-[1rem] text-[#2A1A10] outline-none transition placeholder:text-[#A08C7B] focus:border-[#B9733A] focus:ring-4 focus:ring-[#B9733A]/15 disabled:cursor-not-allowed disabled:opacity-60";

/* ---------- Small building block ---------- */

const Field = ({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {hint ? (
        <span className="text-[0.8125rem] text-[#7A6455]">{hint}</span>
      ) : null}
    </div>
    {children}
  </div>
);

/* ---------- Form ---------- */

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceNumber = Number(price);
  const priceValid =
    price !== "" && Number.isFinite(priceNumber) && priceNumber > 0;

  const checklist = [
    { label: "Item name", done: name.trim().length > 0 },
    { label: "Category", done: category !== "" },
    { label: "Description", done: description.trim().length > 0 },
    { label: "Price", done: priceValid },
    { label: "Location", done: location.trim().length > 0 },
    { label: "At least one photo", done: images.length > 0 },
  ];
  const completed = checklist.filter((item) => item.done).length;

  const resetForm = () => {
    setName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setLocation("");
    setImages([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanLocation = location.trim();

    if (!cleanName) return toast.error("Item name is required");
    if (!category) return toast.error("Please select a category");
    if (!cleanDescription) return toast.error("Please add a description");
    if (!priceValid) {
      return toast.error("Enter a valid price", {
        description: "Price must be greater than 0.",
      });
    }
    if (!cleanLocation) return toast.error("Location is required");
    if (images.length === 0) {
      return toast.error("Add at least one image", {
        description: "Item images are required.",
      });
    }
    if (isUploading) {
      return toast.info("Images are still uploading", {
        description: "Give it a second, then try again.",
      });
    }

    const postData = {
      name: cleanName,
      category,
      description: cleanDescription,
      price: priceNumber,
      location: cleanLocation,
      images,
      image: images[0],
    };

    setIsSubmitting(true);

    try {
      // TODO: এখানে আপনার API fetch করুন, payload পাঠান।
      console.log('payload', {postData});

      // সফল হলে: toast.success(...), resetForm(), router.refresh() ইত্যাদি।
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      {/* ---------- Left column: details ---------- */}
      <section className={cardClass} aria-labelledby="details-heading">
        <h2 id="details-heading" className={cardTitleClass}>
          Item details
        </h2>
        <p className={cardHintClass}>
          Tell customers what they are ordering and what it costs.
        </p>

        <div className="mt-7 flex flex-col gap-6">
          <Field label="Item name" htmlFor="item-name">
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Classic Margherita Pizza"
              disabled={isSubmitting}
              className={fieldClass}
            />
          </Field>

          <div className="flex flex-col gap-2">
            <span className={labelClass} id="category-label">
              Category
            </span>
            <div
              role="radiogroup"
              aria-labelledby="category-label"
              className="flex flex-wrap gap-2.5"
            >
              {PIZZA_CATEGORIES.map((item) => {
                const selected = category === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={isSubmitting}
                    onClick={() => setCategory(item.value)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-sans text-[0.9375rem] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B9733A]/25 disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? "border-[#3B2417] bg-[#3B2417] text-[#F5EDE3]"
                        : "border-[#EADBC8] bg-white text-[#3B2417] hover:border-[#B9733A] hover:bg-[#F5EDE3]"
                    }`}
                  >
                    {selected ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : null}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Field
            label="Description"
            htmlFor="item-description"
            hint={`${description.length}/${MAX_DESCRIPTION}`}
          >
            <textarea
              id="item-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value.slice(0, MAX_DESCRIPTION))
              }
              rows={5}
              placeholder="Describe the crust, toppings and what makes it special…"
              disabled={isSubmitting}
              className={`${fieldClass} h-auto min-h-36 resize-y py-3 leading-relaxed`}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Price (USD)" htmlFor="item-price">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[1rem] text-[#7A6455]"
                >
                  $
                </span>
                <input
                  id="item-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="12.99"
                  disabled={isSubmitting}
                  className={`${fieldClass} pl-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />
              </div>
            </Field>

            <Field label="Location (area / city)" htmlFor="item-location">
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#A08C7B]"
                  aria-hidden="true"
                />
                <input
                  id="item-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Dhaka, Gulshan"
                  disabled={isSubmitting}
                  className={`${fieldClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* ---------- Right column: photos + publish ---------- */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6">
        <section className={cardClass} aria-labelledby="photos-heading">
          <h2 id="photos-heading" className={cardTitleClass}>
            Photos
          </h2>
          <p className={cardHintClass}>
            The first photo is the cover customers see on the menu.
          </p>
          <div className="mt-6">
            <ImageUploader
              value={images}
              onChange={setImages}
              onUploadingChange={setIsUploading}
              isUploading={isUploading}
              disabled={isSubmitting}
            />
          </div>
        </section>

        <section className={cardClass} aria-labelledby="publish-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="publish-heading" className={cardTitleClass}>
              Publish
            </h2>
            <span className="font-sans text-[0.875rem] text-[#B9733A]">
              {completed}/{checklist.length} done
            </span>
          </div>

          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-[#EADBC8]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={checklist.length}
            aria-valuenow={completed}
            aria-label="Form completion"
          >
            <div
              className="h-full rounded-full bg-[#B9733A] transition-all duration-300"
              style={{ width: `${(completed / checklist.length) * 100}%` }}
            />
          </div>

          <ul className="mt-5 flex flex-col gap-2.5">
            {checklist.map((item) => (
              <li
                key={item.label}
                className={`flex items-center gap-2.5 text-[0.9375rem] transition-colors ${
                  item.done ? "text-[#3B2417]" : "text-[#7A6455]"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                    item.done
                      ? "border-[#B9733A] bg-[#B9733A] text-[#F5EDE3]"
                      : "border-[#D9C3A8] bg-white"
                  }`}
                >
                  {item.done ? (
                    <Check
                      className="size-3"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                {item.label}
              </li>
            ))}
          </ul>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            aria-busy={isSubmitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 font-sans text-[1rem] text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B9733A]/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#3B2417]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Creating item…
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Uploading photos…
              </>
            ) : (
              <>
                <ImagePlus className="size-5" aria-hidden="true" />
                Create menu item
              </>
            )}
          </button>
        </section>
      </div>
    </form>
  );
};

export default AddItemForm;