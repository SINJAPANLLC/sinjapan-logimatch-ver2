'use client'

import { useState, useEffect } from 'react'

interface CountUpAnimationProps {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function CountUpAnimation({ 
  end, 
  duration = 2000, 
  className = '',
  prefix = '',
  suffix = ''
}: CountUpAnimationProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // イージング関数（easeOutCubic）
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOutCubic * end)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    // 少し遅延を入れてアニメーションを開始
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
