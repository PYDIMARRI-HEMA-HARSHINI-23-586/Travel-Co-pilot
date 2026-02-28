"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface HotelDetails {
  hotel_id: number;
  hotel_name: string;
  city: string;
  address: string;
  country: string;
  star_rating: number;
  contact_email: string;
  contact_phone: string;
  description: string;
  room_type_id: number;
  room_description: string;
  max_adults: number;
  max_children: number;
  min_price: number;
  max_price: number;
  available_rooms: number;
}

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotelDetails();
  }, []);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/hotel/${id}`);
      if (!response.ok) throw new Error("Failed to fetch hotel details");
      const data = await response.json();
      setHotel(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!hotel) return;

    setBooking(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/book-hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotel.hotel_id,
          room_type_id: hotel.room_type_id,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      alert("Hotel booked successfully! 🎉");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">⚠️ {error || "Hotel not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-gray-400 hover:text-white transition"
        >
          ← Back to Search
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hotel.hotel_name}</h1>
              <p className="text-gray-400">{hotel.city}, {hotel.country}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 text-2xl">{"⭐".repeat(hotel.star_rating)}</p>
              <p className="text-sm text-gray-400 mt-1">{hotel.star_rating}-Star Hotel</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-white/10">
            <p className="text-gray-300">{hotel.address}</p>
          </div>

          {/* Hotel Description */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <h2 className="text-xl font-semibold mb-3">About This Hotel</h2>
            <p className="text-gray-300 leading-relaxed">{hotel.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{hotel.contact_email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Phone</p>
              <p className="text-white">{hotel.contact_phone}</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-white/10">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Room Type</p>
                <p className="text-white">{hotel.room_description}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Capacity</p>
                <p className="text-white">{hotel.max_adults} Adults, {hotel.max_children} Children</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Available Rooms</p>
                <p className="text-white">{hotel.available_rooms} rooms</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="flex items-baseline gap-4">
              <div>
                <p className="text-gray-400 text-sm">Starting from</p>
                <p className="text-3xl font-bold text-emerald-400">₹{hotel.min_price.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">per night</p>
              </div>
              {hotel.max_price !== hotel.min_price && (
                <div>
                  <p className="text-gray-400 text-sm">Up to</p>
                  <p className="text-xl font-semibold text-gray-300">₹{hotel.max_price.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleBookNow}
            disabled={booking || hotel.available_rooms === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
              booking || hotel.available_rooms === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105"
            }`}
          >
            {booking ? "Booking..." : hotel.available_rooms === 0 ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </main>
  );
}
