"use client"
import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 shadow-sm hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark',
        ghost: 'bg-transparent hover:bg-gray-100 text-text-primary',
        outline: 'border border-gray-300 bg-surface hover:bg-gray-50 text-text-primary'
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-10 px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }