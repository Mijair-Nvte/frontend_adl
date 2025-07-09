import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
     className={cn(
        `block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 
         placeholder-gray-400  outline-none transition duration-200 ease-in-out 
         focus:border-indigo-500 focus:ring focus:ring-indigo-100 
         disabled:opacity-50 disabled:cursor-not-allowed resize-y
         dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400
         dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20`,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
