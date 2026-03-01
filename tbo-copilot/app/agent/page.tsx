"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseAndSearch, HotelResult } from "@/lib/api";

export default function AgentPage() {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingSelections, setPendingSelections] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [pricePredictions, setPricePredictions] = useState<{[key: string]: any}>({});
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "agent") {
      router.push("/login");
      return;
    }
    setUser(parsed);
    fetchPendingRequests();
    fetchPendingSelections();
    
    const interval = setInterval(() => {
      fetchPendingRequests();
      fetchPendingSelections();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/agent/requests");
      const data = await response.json();
      if (data.success) {
        setPendingRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const fetchPendingSelections = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/agent/pending-selections");
      const data = await response.json();
      if (data.success) {
        setPendingSelections(data.selections);
      }
    } catch (err) {
      console.error("Failed to fetch selections:", err);
    }
  };

  const processRequest = async (request: any) => {
    setActiveRequest(request);
    setQuery(request.request_text);
    setShowNotifications(false);
    
    await fetch(`http://localhost:3000/api/agent/request/${request.request_id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "processing", agent_id: user.id }),
    });
    
    fetchPendingRequests();
  };

  const askCopilot = async () => {
    if (!query) return;
    
    setLoading(true);
    setHotels([]);
    setPricePredictions({});

    try {
      const response = await parseAndSearch(query);
      if (response.success && response.data) {
        setHotels(response.data);
        
        // Fetch price predictions for each hotel
        const predictions: {[key: string]: any} = {};
        for (const hotel of response.data.slice(0, 10)) {
          try {
            const predRes = await fetch('http://localhost:3000/api/price-prediction', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                hotel: hotel, 
                check_in_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              })
            });
            const predData = await predRes.json();
            if (predData.success) {
              predictions[`${hotel.hotel_id}-${hotel.room_type_id}`] = predData.prediction;
            }
          } catch (err) {
            console.error('Prediction error:', err);
          }
        }
        setPricePredictions(predictions);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendToCustomer = async () => {
    if (!activeRequest || hotels.length === 0) return;

    try {
      await fetch("http://localhost:3000/api/agent/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: activeRequest.request_id,
          hotel_list: hotels,
        }),
      });

      setActiveRequest(null);
      setHotels([]);
      setQuery("");
      fetchPendingRequests();
      alert("Response sent to customer!");
    } catch (err) {
      console.error("Failed to send response:", err);
    }
  };

  const finalizeBooking = (hotel: HotelResult) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedHotel) return;

    try {
      const response = await fetch("http://localhost:3000/api/agent/book-for-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: selectedHotel.hotel_id,
          room_type_id: selectedHotel.room_type_id,
          hotel_data: selectedHotel,
          request_id: activeRequest?.request_id,
          customer_id: activeRequest?.customer_id,
          agent_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to completed tasks
        const task = {
          id: Date.now(),
          hotel_name: selectedHotel.hotel_name,
          customer: activeRequest?.customer_name || "Direct Booking",
          timestamp: new Date().toLocaleString(),
          price: selectedHotel.min_price,
        };
        setCompletedTasks([task, ...completedTasks]);
        
        // Show success animation
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setShowBookingModal(false);
          setSelectedHotel(null);
          
          // Clear active request if exists
          if (activeRequest) {
            setActiveRequest(null);
            setHotels([]);
            setQuery("");
            fetchPendingRequests();
          }
        }, 3000);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to complete booking");
    }
  };

  const confirmCustomerSelection = async (booking: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/agent/confirm-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: booking.booking_id,
          agent_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to completed tasks
        const task = {
          id: Date.now(),
          hotel_name: booking.hotel_data.hotel_name,
          customer: booking.customer_name,
          timestamp: new Date().toLocaleString(),
          price: booking.hotel_data.min_price,
        };
        setCompletedTasks([task, ...completedTasks]);
        
        alert("✅ Booking confirmed! Customer has been notified.");
        fetchPendingSelections();
      } else {
        alert(data.error || "Confirmation failed");
      }
    } catch (err) {
      console.error("Confirmation error:", err);
      alert("Failed to confirm booking");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Notification Bell */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-3 bg-white/10 hover:bg-white/20 rounded-xl transition backdrop-blur-xl border border-white/10"
        >
          🔔
          {(pendingRequests.length + pendingSelections.length) > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length + pendingSelections.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
            {/* Customer Selections */}
            {pendingSelections.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-3 text-emerald-400">✅ Customer Selections ({pendingSelections.length})</h3>
                <div className="space-y-2">
                  {pendingSelections.map((selection) => (
                    <div
                      key={selection.booking_id}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3"
                    >
                      <p className="text-sm font-semibold text-emerald-400">
                        {selection.customer_name}
                      </p>
                      <p className="text-xs text-white mt-1">
                        Selected: {selection.hotel_data.hotel_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ₹{selection.hotel_data.min_price?.toLocaleString()} per night
                      </p>
                      <button
                        onClick={() => {
                          confirmCustomerSelection(selection);
                          setShowNotifications(false);
                        }}
                        className="mt-2 w-full px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition"
                      >
                        ✅ Confirm Booking
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Requests */}
            <h3 className="font-semibold mb-3">📬 Customer Requests ({pendingRequests.length})</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-gray-400">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div
                    key={req.request_id}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition cursor-pointer"
                    onClick={() => processRequest(req)}
                  >
                    <p className="text-sm font-semibold text-emerald-400">
                      {req.customer_name}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{req.request_text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completed Tasks Sidebar */}
      {completedTasks.length > 0 && (
        <div className="fixed left-6 top-24 w-80 bg-black/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-3 text-emerald-400 flex items-center gap-2">
            ✅ Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 animate-pulse"
              >
                <p className="text-sm font-semibold text-white">{task.hotel_name}</p>
                <p className="text-xs text-gray-400 mt-1">Customer: {task.customer}</p>
                <p className="text-xs text-emerald-400 mt-1">₹{task.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{task.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-black border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {!bookingSuccess ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Hotel</p>
                    <p className="text-lg font-semibold">{selectedHotel.hotel_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{selectedHotel.city}, {selectedHotel.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Room Type</p>
                    <p className="text-white">{selectedHotel.room_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Price per night</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ₹{selectedHotel.min_price.toLocaleString()}
                    </p>
                  </div>
                  {activeRequest && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <p className="text-sm text-blue-300">Booking for: {activeRequest.customer_name}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedHotel(null);
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">✅</div>
                <h2 className="text-3xl font-bold text-emerald-400 mb-2">Task Accomplished!</h2>
                <p className="text-gray-400">Booking confirmed successfully</p>
                <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-sm text-emerald-300 font-semibold">{selectedHotel.hotel_name}</p>
                  <p className="text-xs text-gray-400 mt-1">₹{selectedHotel.min_price.toLocaleString()} per night</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">🤖 Agent Dashboard</h1>
            <p className="text-gray-400">Welcome, {user.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
          >
            Logout
          </button>
        </div>

        {activeRequest && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
            <p className="text-sm text-blue-300 font-semibold">
              📌 Processing request from: {activeRequest.customer_name}
            </p>
            <p className="text-xs text-gray-400 mt-1">{activeRequest.customer_email}</p>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 mb-8">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search hotels using AI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCopilot()}
              className="flex-1 bg-transparent outline-none px-3 py-3 text-sm text-white placeholder-gray-400"
            />
            <button
              onClick={askCopilot}
              className="px-5 py-2 rounded-xl font-semibold bg-white text-black hover:scale-105 transition"
            >
              Search
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-400 animate-pulse">Searching hotels…</p>}

        {hotels.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Found {hotels.length} hotels</p>
              {activeRequest && (
                <button
                  onClick={sendToCustomer}
                  className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition"
                >
                  ✉️ Send to Customer
                </button>
              )}
            </div>

            {hotels.map((hotel) => {
              const hotelKey = `${hotel.hotel_id}-${hotel.room_type_id}`;
              const prediction = pricePredictions[hotelKey];
              
              return (
              <div
                key={hotelKey}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                  <p className="text-yellow-400 text-lg">{"⭐".repeat(hotel.star_rating)}</p>
                </div>

                <p className="mt-3 text-sm text-gray-300">{hotel.address}</p>

                <div className="mt-4 flex gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Room Type</p>
                    <p className="text-white">{hotel.room_description}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Capacity</p>
                    <p className="text-white">
                      {hotel.max_adults} Adults, {hotel.max_children} Children
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Price per night</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ₹{hotel.min_price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Available</p>
                    <p className="text-white">{hotel.available_rooms} rooms</p>
                  </div>
                </div>

                {/* Price Prediction */}
                {prediction && (
                  <div className={`mt-4 p-4 rounded-xl border-2 ${
                    prediction.status === 'increasing' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : prediction.status === 'decreasing'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-gray-500/10 border-gray-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {prediction.status === 'increasing' ? '🔴' : prediction.status === 'decreasing' ? '🔵' : '⚪'}
                        </span>
                        <div>
                          <p className={`font-semibold ${
                            prediction.status === 'increasing' ? 'text-red-400' : 
                            prediction.status === 'decreasing' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {prediction.message}
                          </p>
                          <p className="text-xs text-gray-400">Confidence: {prediction.confidence}%</p>
                        </div>
                      </div>
                      {prediction.predictedChange !== 0 && (
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            prediction.predictedChange > 0 ? 'text-red-400' : 'text-blue-400'
                          }`}>
                            {prediction.predictedChange > 0 ? '+' : ''}{prediction.predictedChange.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-400">
                            ₹{prediction.predictedPrice.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white font-semibold mb-2">{prediction.recommendation}</p>
                    {prediction.factors && prediction.factors.length > 0 && (
                      <div className="text-xs text-gray-400 space-y-1">
                        {prediction.factors.slice(0, 3).map((factor: string, idx: number) => (
                          <p key={idx}>• {factor}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => finalizeBooking(hotel)}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition shadow-lg"
                >
                  ✅ Finalize Booking
                </button>
              </div>
            )})}
          </div>
        )}
      </div>
    </main>
  );
}
