"use client";
import { useState, useEffect } from "react";

export default function ViolationsCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const response = await fetch("/api/violations/count").then((res) =>
        res.json()
      );
      if (response.error) {
        console.error("Error fetching count:", response.error);
        setCount(null);
      } else {
        setCount(response.count);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold">Total Violations Count</h2>
      <p className="text-gray-700">{count !== null ? count : "Loading..."}</p>
    </div>
  );
}
