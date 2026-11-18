"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star, UploadCloud, X } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGES = 5;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error("Image upload is not configured.");

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body },
  );
  const result = await response.json();

  if (!response.ok || !result?.success || !result?.data?.url) {
    throw new Error(result?.error?.message ?? "Upload failed");
  }
  return result.data.url as string;
}

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  isUploading: boolean;
  disabled?: boolean;
};

const ImageUploader = ({
  value,
  onChange,
  onUploadingChange,
  isUploading,
  disabled,
}: ImageUploaderProps) => {
  const [dragging, setDragging] = useState(false);
  const locked = disabled || isUploading;

  const processFiles = async (incoming: File[]) => {
    if (incoming.length === 0) return;

    const slots = MAX_IMAGES - value.length;
    if (slots <= 0) {
      toast.error(`You can add up to ${MAX_IMAGES} images`);
      return;
    }

    const accepted = incoming
      .filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`${file.name} is too large`, {
            description: "Each image must be 2MB or smaller.",
          });
          return false;
        }
        return true;
      })
      .slice(0, slots);

    if (accepted.length === 0) return;

    onUploadingChange(true);
    const results = await Promise.allSettled(accepted.map(uploadToImgBB));

    const uploaded: string[] = [];
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else {
        toast.error(`Could not upload ${accepted[i].name}`, {
          description:
            result.reason instanceof Error
              ? result.reason.message
              : "Please try again.",
        });
      }
    });

    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    onUploadingChange(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // allow picking the same file again
    void processFiles(files);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (locked) return;
    void processFiles(Array.from(event.dataTransfer.files));
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));
  const makeCover = (url: string) =>
    onChange([url, ...value.filter((u) => u !== url)]);

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor="item-images"
        onDragOver={(event) => {
          event.preventDefault();
          if (!locked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging
            ? "border-[#B9733A] bg-[#B9733A]/10"
            : "border-[#D9C3A8] bg-white hover:border-[#B9733A] hover:bg-[#F5EDE3]"
        } ${locked ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="grid size-12 place-items-center rounded-full bg-[#F5EDE3] text-[#B9733A]">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud className="size-6" aria-hidden="true" />
          )}
        </span>
        <span className="font-sans text-[1rem] text-[#3B2417]">
          {isUploading ? "Uploading…" : "Click to upload or drag and drop"}
        </span>
        <span className="text-[0.875rem] text-[#7A6455]">
          PNG or JPG, up to 2MB each · {value.length}/{MAX_IMAGES} added
        </span>
        <input
          id="item-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleInput}
          disabled={locked}
          className="sr-only"
        />
      </label>

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#EADBC8] bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Food photo ${index + 1}`}
                className="size-full object-cover"
              />

              {index === 0 ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#3B2417] px-2.5 py-1 font-sans text-[0.75rem] text-[#F5EDE3]">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(url)}
                  disabled={disabled}
                  className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 font-sans text-[0.75rem] text-[#3B2417] opacity-100 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  Make cover
                </button>
              )}

              <button
                type="button"
                onClick={() => remove(url)}
                disabled={disabled}
                aria-label="Remove image"
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageUploader;