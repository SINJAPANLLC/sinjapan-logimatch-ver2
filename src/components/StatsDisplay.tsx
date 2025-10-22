import { Package, Truck } from 'lucide-react'
import { useStats } from '@/hooks/useStats'

export default function StatsDisplay() {
  const { stats } = useStats()

  return (
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-3">
        <Package className="h-6 w-6 text-blue-600" />
        <span className="text-gray-600 text-sm">荷物数</span>
        <span className="font-bold text-2xl text-blue-600">{stats.shipmentCount.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-3">
        <Truck className="h-6 w-6 text-green-600" />
        <span className="text-gray-600 text-sm">空車数</span>
        <span className="font-bold text-2xl text-blue-600">{stats.vehicleCount.toLocaleString()}</span>
      </div>
    </div>
  )
}
