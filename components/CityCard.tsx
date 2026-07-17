"use client";

type Props = {
  city: string;
  country: string;
  people: number;
};

export default function CityCard({
  city,
  country,
  people,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        top: 30,
        width: 280,
        padding: 20,
        borderRadius: 16,
        background: "rgba(12,18,30,.92)",
        color: "white",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 15px 40px rgba(0,0,0,.35)",
        zIndex: 100,
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: 6,
          fontSize: 24,
        }}
      >
        {city}
      </h2>

      <div
        style={{
          opacity: .7,
          marginBottom: 20,
        }}
      >
        {country}
      </div>

      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: "#FFD84A",
        }}
      >
        {people}
      </div>

      <div
        style={{
          opacity: .7,
        }}
      >
        земляков
      </div>
    </div>
  );
}