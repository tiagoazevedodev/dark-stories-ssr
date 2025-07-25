import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-noir hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-noir hover:bg-destructive/80",
        outline: "text-foreground border-border bg-background/50 backdrop-blur-sm",
        crimson: "border-transparent bg-crimson-500/10 text-crimson-400 border border-crimson-500/20",
        amber: "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20",
        noir: "border-transparent bg-noir-700/50 text-noir-200 border border-noir-600/50",
        success: "border-transparent bg-green-500/10 text-green-400 border border-green-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 