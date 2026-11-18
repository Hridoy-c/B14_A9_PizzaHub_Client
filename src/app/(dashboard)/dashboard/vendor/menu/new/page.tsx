import AddItemForm from "@/components/dashboard/vendor/AddItemForm";

const VendorAddItemPage = () => (
  <div className="flex flex-col gap-8">
    <header>
      <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
        Add item
      </h1>
      <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
        Create a new pizza or side and publish it straight to the menu.
      </p>
    </header>

    <AddItemForm />
  </div>
);

export default VendorAddItemPage;