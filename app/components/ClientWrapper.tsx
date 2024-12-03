'use client'

interface Props {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: Props) {
  return <>{children}</>
}
