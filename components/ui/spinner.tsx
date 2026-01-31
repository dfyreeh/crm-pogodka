import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("h-4 w-4 animate-[spin_2s_linear_infinite]", className)}
      {...props}
    />
  );
}
