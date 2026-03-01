"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<any>(null);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "customer") {
      router.push("/login");
      return;
    }
    setUser(parsed);
    fetchRequests(parsed.id);
    fetchBookings(parsed.id);
    
    const interval = setInterval(() => {
      fetchRequests(parsed.id);
      fetchBookings(parsed.id);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async (customerId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/requests/${customerId}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const fetchBookings = async (customerId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/bookings/${customerId}`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const submitRequest = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/customer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.id,
          request_text: query,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuery("");
        fetchRequests(user.id);
      }
    } catch (err) {
      console.error("Failed to submit request:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectHotel = async (hotel: any, requestId: number) => {
    // Check if customer already has a pending selection for this request
    const existingBooking = bookings.find(
      (b) => b.request_id === requestId && b.status === "customer_selected"
    );

    if (existingBooking) {
      const confirmReplace = window.confirm(
        `You already selected "${existingBooking.hotel_data.hotel_name}".\n\nDo you want to replace it with "${hotel.hotel_name}"?`
      );
      
      if (!confirmReplace) {
        return; // User cancelled
      }
    }

    try {
      const response = await fetch("http://localhost:3000/api/customer/select-hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: requestId,
          customer_id: user.id,
          hotel_data: hotel,
          replace_existing: !!existingBooking,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Hotel selection sent to agent for confirmation!");
        fetchRequests(user.id);
        fetchBookings(user.id);
      }
    } catch (err) {
      console.error("Failed to select hotel:", err);
      alert("Failed to select hotel");
    }
  };

  const viewHotelDetails = async (hotel: any) => {
    setSelectedHotel(hotel);
    setShowHotelModal(true);
    setNearbyPlaces(null);
    
    // Fetch nearby places
    setLoadingNearby(true);
    try {
      const response = await fetch("http://localhost:3000/api/nearby-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_name: hotel.hotel_name,
          city: hotel.city,
          address: hotel.address,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNearbyPlaces(data.nearby);
      }
    } catch (err) {
      console.error("Failed to fetch nearby places:", err);
    } finally {
      setLoadingNearby(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">👤 Customer Portal</h1>
            <p className="text-gray-400">Welcome, {user.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🔍 Request Hotel Search</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitRequest()}
              placeholder="e.g., 5-star luxury hotel in Mumbai for 2 adults and 1 child from 15th March to 20th March"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-white/40"
            />
            <button
              onClick={submitRequest}
              disabled={loading}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your request will be sent to our agent who will search and send you the best hotels
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📋 My Requests</h2>
          {requests.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
              No requests yet. Submit your first hotel search request above!
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.request_id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-gray-300">{req.request_text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : req.status === "processing"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.hotel_list && req.sent_to_customer && (
                  <div className="mt-4 space-y-3">
                    {/* Check if agent has already booked for this request */}
                    {bookings.some((b) => b.request_id === req.request_id && b.status === "agent_confirmed") ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <p className="text-sm font-semibold text-emerald-400 mb-3">
                          ✅ Your agent selected the best hotel for you!
                        </p>
                        {req.hotel_list.filter((hotel: any) => 
                          bookings.some((b) => 
                            b.request_id === req.request_id && 
                            b.status === "agent_confirmed" &&
                            b.hotel_data.hotel_id === hotel.hotel_id &&
                            b.hotel_data.room_type_id === hotel.room_type_id
                          )
                        ).map((hotel: any, idx: number) => (
                          <div key={idx} className="bg-white/5 border border-emerald-500/30 rounded-xl p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{hotel.hotel_name}</h3>
                                <p className="text-sm text-gray-400">
                                  {hotel.city}, {hotel.country}
                                </p>
                                <p className="text-yellow-400 text-sm mt-1">
                                  {"⭐".repeat(hotel.star_rating)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">Price per night</p>
                                <p className="text-xl font-bold text-emerald-400">
                                  ₹{hotel.min_price?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{hotel.room_description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Capacity: {hotel.max_adults} Adults, {hotel.max_children} Children
                            </p>
                            <button
                              onClick={() => viewHotelDetails(hotel)}
                              className="mt-3 w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm"
                            >
                              📋 View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-emerald-400">
                          ✅ Agent Response ({req.hotel_list.length} hotels found)
                        </p>
                        {req.hotel_list.map((hotel: any, idx: number) => {
                          const isSelected = bookings.some(
                            (b) =>
                              b.request_id === req.request_id &&
                              b.status === "customer_selected" &&
                              b.hotel_data.hotel_id === hotel.hotel_id &&
                              b.hotel_data.room_type_id === hotel.room_type_id
                          );
                          
                          return (
                            <div
                              key={idx}
                              className={`bg-white/5 border rounded-xl p-4 hover:border-emerald-500/30 transition ${
                                isSelected ? "border-emerald-500 bg-emerald-500/10" : "border-white/10"
                              }`}
                            >
                              {isSelected && (
                                <div className="mb-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg inline-block">
                                  <span className="text-xs text-emerald-400 font-semibold">✅ Your Selection</span>
                                </div>
                              )}
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white">{hotel.hotel_name}</h3>
                                  <p className="text-sm text-gray-400">
                                    {hotel.city}, {hotel.country}
                                  </p>
                                  <p className="text-yellow-400 text-sm mt-1">
                                    {"⭐".repeat(hotel.star_rating)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-400">Price per night</p>
                                  <p className="text-xl font-bold text-emerald-400">
                                    ₹{hotel.min_price?.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">{hotel.room_description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Capacity: {hotel.max_adults} Adults, {hotel.max_children} Children
                              </p>
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => viewHotelDetails(hotel)}
                                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm"
                                >
                                  📋 View Details
                                </button>
                                <button
                                  onClick={() => selectHotel(hotel, req.request_id)}
                                  className={`flex-1 px-4 py-2 rounded-lg transition text-sm font-semibold ${
                                    isSelected
                                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                                  }`}
                                >
                                  {isSelected ? "🔄 Change Selection" : "✅ Select This Hotel"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

                {req.status === "pending" && (
                  <p className="text-sm text-gray-400 mt-3">
                    ⏳ Waiting for agent to process your request...
                  </p>
                )}
                {req.status === "processing" && (
                  <p className="text-sm text-yellow-400 mt-3">
                    🔄 Agent is searching hotels for you...
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bookings Section */}
        {bookings.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">🎫 My Bookings</h2>
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {booking.hotel_data.hotel_name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {booking.hotel_data.city}, {booking.hotel_data.country}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "agent_confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {booking.status === "agent_confirmed" ? "✅ Confirmed" : "⏳ Pending Agent"}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm">
                    {"⭐".repeat(booking.hotel_data.star_rating)}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">{booking.hotel_data.room_description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Price per night</p>
                      <p className="text-lg font-bold text-emerald-400">
                        ₹{booking.hotel_data.min_price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Selected on</p>
                      <p className="text-xs text-white">
                        {new Date(booking.customer_selected_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {booking.status === "agent_confirmed" && booking.agent_name && (
                    <p className="text-xs text-green-400 mt-3">
                      ✅ Confirmed by {booking.agent_name} on{" "}
                      {new Date(booking.agent_confirmed_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotel Details Modal */}
        {showHotelModal && selectedHotel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/20 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedHotel.hotel_name}</h2>
                <button
                  onClick={() => setShowHotelModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{selectedHotel.city}, {selectedHotel.country}</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedHotel.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="text-yellow-400 text-lg">
                    {"⭐".repeat(selectedHotel.star_rating)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Room Type</p>
                  <p className="text-white">{selectedHotel.room_description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Capacity</p>
                    <p className="text-white">
                      {selectedHotel.max_adults} Adults, {selectedHotel.max_children} Children
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Available Rooms</p>
                    <p className="text-white">{selectedHotel.available_rooms} rooms</p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Price per night</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    ₹{selectedHotel.min_price?.toLocaleString()}
                  </p>
                </div>

                {/* Nearby Places Section */}
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h3 className="text-lg font-semibold mb-3">📍 Nearby Places</h3>
                  {loadingNearby ? (
                    <p className="text-sm text-gray-400 animate-pulse">Loading nearby places...</p>
                  ) : nearbyPlaces ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {nearbyPlaces.airports && nearbyPlaces.airports.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-blue-400 mb-1">✈️ Airports</p>
                          {nearbyPlaces.airports.map((airport: any, idx: number) => (
                            <p key={idx} className="text-xs text-gray-300 ml-4">
                              • {airport.name} ({airport.distance}) - {airport.travel_time}
                            </p>
                          ))}
                        </div>
                      )}
                      {nearbyPlaces.attractions && nearbyPlaces.attractions.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-400 mb-1">🏛️ Attractions</p>
                          {nearbyPlaces.attractions.map((attr: any, idx: number) => (
                            <p key={idx} className="text-xs text-gray-300 ml-4">
                              • {attr.name} ({attr.distance}) {attr.type && `- ${attr.type}`}
                            </p>
                          ))}
                        </div>
                      )}
                      {nearbyPlaces.restaurants && nearbyPlaces.restaurants.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-orange-400 mb-1">🍽️ Restaurants</p>
                          {nearbyPlaces.restaurants.map((rest: any, idx: number) => (
                            <p key={idx} className="text-xs text-gray-300 ml-4">
                              • {rest.name} ({rest.distance}) {rest.cuisine && `- ${rest.cuisine}`}
                            </p>
                          ))}
                        </div>
                      )}
                      {nearbyPlaces.shopping && nearbyPlaces.shopping.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-pink-400 mb-1">🛍️ Shopping</p>
                          {nearbyPlaces.shopping.map((shop: any, idx: number) => (
                            <p key={idx} className="text-xs text-gray-300 ml-4">
                              • {shop.name} ({shop.distance})
                            </p>
                          ))}
                        </div>
                      )}
                      {nearbyPlaces.insights && nearbyPlaces.insights.length > 0 && (
                        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-400 mb-2">💡 Location Insights</p>
                          {nearbyPlaces.insights.map((insight: string, idx: number) => (
                            <p key={idx} className="text-xs text-gray-300">
                              • {insight}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No nearby places data available</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowHotelModal(false)}
                className="mt-6 w-full px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
