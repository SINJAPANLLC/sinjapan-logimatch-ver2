import { useState, useEffect } from 'react'

export const useStats = () => {
  const [stats, setStats] = useState({ shipmentCount: 0, vehicleCount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('Failed to load stats')
      
      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, refetch: loadStats }
}
