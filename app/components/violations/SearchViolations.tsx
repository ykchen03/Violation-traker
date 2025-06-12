"use client";
import { useState } from "react";

export default function SearchViolations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a license plate.");
      return;
    }
    setError(null);

    fetchViolations(searchTerm);
  };

  const fetchViolations = async (term: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/violations/search?term=${encodeURIComponent(term)}`
      ).then((res) => res.json());
      if (response.error) {
        throw new Error(response.error);
      }

      setHasSearched(true);
      setViolations(response.violations || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch violations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Search Violations</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="plate" className="block text-gray-700 mb-2">
            License Plate:
          </label>
          <input
            id="plate"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter license plate"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          onClick={() => fetchViolations(searchTerm)}
          className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Search
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {violations.length > 0 ? (
          <ul className="mt-4">
            {violations.map((violation) => (
              <li key={violation.id} className="border-b py-2">
                Plate: {violation.plate}, Count: {violation.count}
              </li>
            ))}
          </ul>
        ) : (
          hasSearched &&
          !loading && <p>No violations found for "{searchTerm}"</p> // <-- only show after search
        )}
      </form>
    </div>
  );
}
