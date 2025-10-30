"use client"
import { FaSpinner } from 'react-icons/fa'
import { cn } from '../lib/utils'

export default function Spinner({ className }) {
  return <FaSpinner className={cn('w-6 h-6 animate-spin text-primary', className)} />
}