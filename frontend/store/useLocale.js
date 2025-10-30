"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLocale = create(persist((set) => ({
  lang: 'en',
  // Use this function to set the language from the dropdown
  setLang: (lang) => set({ lang }),
  
  // Kept 'toggle' in case it's used anywhere, but setLang is preferred
  toggle: () => set((s) => ({ lang: s.lang === 'en' ? 'hi' : 'en' }))
}), { name: 'mgnrega-lang-store-v2' })) // Renamed storage key to avoid conflicts