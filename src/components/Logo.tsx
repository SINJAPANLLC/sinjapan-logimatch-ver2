'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  href?: string
  width?: number
  height?: number
  className?: string
  linkable?: boolean
}

export default function Logo({ href = '/', width = 180, height = 60, className = '', linkable = true }: LogoProps) {
  const imageElement = (
    <Image
      src="/logo.png"
      alt="SIN JAPAN LOGI MATCH"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  )

  if (linkable) {
    return (
      <Link href={href} className={`flex items-center ${className}`}>
        {imageElement}
      </Link>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      {imageElement}
    </div>
  )
}

