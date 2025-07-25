import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-noir hover:shadow-noir-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-noir hover:shadow-noir-lg",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-noir",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-noir hover:shadow-noir-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none transform-none hover:transform-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none transform-none hover:transform-none",
        noir: "bg-noir-700 text-noir-50 hover:bg-noir-600 border border-noir-600 shadow-noir hover:shadow-noir-lg",
        crimson: "bg-gradient-to-r from-crimson-600 to-crimson-500 text-white hover:from-crimson-700 hover:to-crimson-600 shadow-crimson hover:shadow-crimson",
        amber: "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 shadow-amber hover:shadow-amber",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 