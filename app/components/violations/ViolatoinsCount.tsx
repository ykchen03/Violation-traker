"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function ViolationsCount() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            const { count, error } = await supabase
                .from("violations")
                .select("*", { count: "exact", head: true });

            setCount(count ?? null);
            if (error) {
                console.error("Error fetching count:", error);
            } else {
                console.log("Total violations count:", count);
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
};