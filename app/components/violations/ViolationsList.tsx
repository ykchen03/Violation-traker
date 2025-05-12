"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Violation } from '@/app/types';

export default function ViolationsList() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('violations')
        .select('*')
        .order('count', { ascending: false });
        
      if (error) throw error;
      
      setViolations(data as Violation[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch violations');
    } finally {
      setLoading(false);
    }
  };

  const toggleList = async () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    if (newVisibility) {
      // Fetch data when showing the list
      await fetchViolations();
      
      // Set up subscription only when list is visible
      const sub = supabase
        .channel('violations-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'violations' }, 
          () => {
            fetchViolations();
          }
        )
        .subscribe();
      setSubscription(sub);
    } else {
      // Unsubscribe when hiding the list
      if (subscription) {
        subscription.unsubscribe();
      }
    }
  };

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [subscription]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recorded Violations</h2>
        <button 
          onClick={toggleList}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {isVisible ? 'Hide List' : 'Show List'}
        </button>
      </div>
      
      {isVisible && (
        <>
          {loading && <div className="text-center py-4">Loading violations...</div>}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && violations.length === 0 && (
            <div className="text-center py-4">No violations recorded yet.</div>
          )}
          
          {!loading && !error && violations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">License Plate</th>
                    <th className="py-2 px-4 border-b text-left">Violation Count</th>
                    <th className="py-2 px-4 border-b text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((violation) => (
                    <tr key={violation.id}>
                      <td className="py-2 px-4 border-b">{violation.plate}</td>
                      <td className="py-2 px-4 border-b">{violation.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}