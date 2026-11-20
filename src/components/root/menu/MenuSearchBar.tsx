"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useMenuParams } from "@/hooks/useMenuParams";

const MenuSearchBar = () => {
  const { searchParams, update, isPending } = useMenuParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({ q: value.trim() || null });
  };

  const handleClear = () => {
    setValue("");
    update({ q: null });
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search the menu"
      className="group flex items-center rounded-full border border-[#EADBC8] bg-white pl-4 transition-all focus-within:border-[#B9733A] focus-within:ring-4 focus-within:ring-[#B9733A]/15"
    >
      <span className="grid size-5 shrink-0 place-items-center text-[#A08C7B] transition-colors group-focus-within:text-[#B9733A]">
        {isPending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="size-5" aria-hidden="true" />
        )}
      </span>

      <label htmlFor="menu-search" className="sr-only">
        Search by pizza name
      </label>
      <input
        ref={inputRef}
        id="menu-search"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search pizzas by name…"
        className="h-13 min-w-0 flex-1 bg-transparent px-3 font-sans text-[1rem] text-[#3B2417] outline-none placeholder:text-[#A08C7B]"
      />

      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-[#7A6455] transition-colors hover:bg-[#F5EDE3] hover:text-[#3B2417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="mr-3 hidden h-6 min-w-6 items-center justify-center rounded-md border border-[#EADBC8] bg-[#F5EDE3] px-1.5 font-sans text-[0.75rem] text-[#7A6455] md:inline-flex"
        >
          /
        </kbd>
      )}

      <button
        type="submit"
        className="m-1.5 inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#3B2417] px-5 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-6"
      >
        Search
      </button>
    </form>
  );
};

export default MenuSearchBar;