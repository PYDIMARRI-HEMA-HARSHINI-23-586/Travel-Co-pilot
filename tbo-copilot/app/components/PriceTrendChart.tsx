"use client";

import { useEffect, useState } from 'react';

interface PriceTrend {
  date: string;
  price: number;
  min: number;
  max: number;
}

interface PriceTrendChartProps {
  hotelId: number;
  roomTypeId: number;
  checkInDate: string;
}

export default function PriceTrendChart({ hotelId, roomTypeId, checkInDate }: PriceTrendChartProps) {
  const [trends, setTrends] = useState<PriceTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [hotelId, roomTypeId, checkInDate]);

  const fetchTrends = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/price-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: hotelId, room_type_id: roomTypeId, check_in_date: checkInDate })
      });
      
      const data = await response.json();
      if (data.success) {
        setTrends(data.trends);
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading price trends...</div>;
  }

  if (trends.length === 0) {
    return <div className="text-gray-400 text-sm">No historical data available yet</div>;
  }

  const maxPrice = Math.max(...trends.map(t => t.max));
  const minPrice = Math.min(...trends.map(t => t.min));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold mb-4">📊 Price Trend (Last 30 Days)</h3>
      
      <div className="relative h-40 flex items-end gap-2">
        {trends.map((trend, i) => {
          const height = ((trend.price - minPrice) / priceRange) * 100;
          const date = new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div 
                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t hover:from-emerald-400 hover:to-emerald-200 transition cursor-pointer"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  ₹{trend.price.toLocaleString()}
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-2 rotate-45 origin-left">{date}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex justify-between text-xs text-gray-400">
        <span>Min: ₹{minPrice.toLocaleString()}</span>
        <span>Max: ₹{maxPrice.toLocaleString()}</span>
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 Prices have {trends[0].price > trends[trends.length - 1].price ? 'increased' : 'decreased'} by{' '}
          {Math.abs(((trends[0].price - trends[trends.length - 1].price) / trends[trends.length - 1].price) * 100).toFixed(1)}%
          {' '}over the last {trends.length} days
        </p>
      </div>
    </div>
  );
}
