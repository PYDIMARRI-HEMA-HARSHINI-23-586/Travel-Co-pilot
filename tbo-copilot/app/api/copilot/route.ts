import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 🔹 Mock hotel data (simulate TBO response)
    const hotels = [
      {
        name: "Sea Breeze Resort",
        price: 5200,
        distanceToBeach: 300,
        freeCancellation: true,
        roomsLeft: 2,
      },
      {
        name: "Goa Palm Stay",
        price: 4800,
        distanceToBeach: 900,
        freeCancellation: false,
        roomsLeft: 5,
      },
      {
        name: "Sunset Bay Hotel",
        price: 6100,
        distanceToBeach: 200,
        freeCancellation: true,
        roomsLeft: 1,
      },
    ];

    // 🔹 Decision Intelligence Scoring
    const scored = hotels.map((hotel) => {
      let score = 0;

      // Budget fit
      if (hotel.price <= 6000) score += 30;

      // Near beach
      if (hotel.distanceToBeach <= 500) score += 25;

      // Free cancellation
      if (hotel.freeCancellation) score += 25;

      // Availability confidence
      if (hotel.roomsLeft <= 2) score += 20;

      return { ...hotel, score };
    });

    // 🔹 Sort hotels by score (highest first)
    const ranked = scored.sort((a, b) => b.score - a.score);

    // 🔹 Prepare Top-3 explainable recommendations
    const topHotels = ranked.slice(0, 3).map((hotel) => ({
      hotelName: hotel.name,
      price: hotel.price,
      confidence: hotel.score,
      reason: `Fits budget, ${hotel.distanceToBeach}m from beach, ${
        hotel.freeCancellation ? "free cancellation" : "limited cancellation"
      }, strong availability confidence.`,
      alert:
        hotel.roomsLeft <= 2 ? "Only a few rooms left at this price." : null,
    }));

    return NextResponse.json({ hotels: topHotels });
  } catch (error) {
    console.error("Copilot API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong in the Copilot engine." },
      { status: 500 },
    );
  }
}
