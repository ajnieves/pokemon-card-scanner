'use client'

import { useEffect } from 'react'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modals with Escape key
      if (e.key === 'Escape') {
        const closeButtons = document.querySelectorAll('[aria-label="Close modal"]')
        if (closeButtons.length > 0) {
          ;(closeButtons[0] as HTMLButtonElement).click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="relative">
      {children}
    </div>
  )
}
