"use client";

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function AddViolationForm() {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const normalizeplate = (plate: string) => {
    return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      setMessage({ type: 'error', text: 'Plate field is required!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const normalizedPlate = normalizeplate(plate);

    try {
      // Check if plate exists
      const { data, error } = await supabase
        .from('violations')
        .select('*')
        .eq('plate', normalizedPlate)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Plate exists, increment count
        const currentCount = data.count;
        const newCount = currentCount + 1;
        
        const { error: updateError } = await supabase
          .from('violations')
          .update({ count: newCount, updated_at: new Date().toISOString() })
          .eq('plate', normalizedPlate);
          
        if (updateError) throw updateError;
        
        setMessage({ 
          type: 'success', 
          text: `Plate '${normalizedPlate}' count incremented!` 
        });
      } else {
        // Plate doesn't exist, insert new
        const { error: insertError } = await supabase
          .from('violations')
          .insert({ 
            plate: normalizedPlate, 
            count: 1,
          });
          
        if (insertError) throw insertError;
        
        setMessage({ 
          type: 'success', 
          text: `'${normalizedPlate}' added successfully!` 
        });
      }
      
      // Clear the input field
      setPlate('');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'Unknown error occurred'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add License Plate Violation</h2>
      
      {message && (
        <div 
          className={`${message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} 
            px-4 py-3 rounded mb-4 border`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="plate" className="block text-gray-700 mb-2">
            License Plate:
          </label>
          <input
            id="plate"
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter license plate"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
        >
          {loading ? 'Processing...' : 'Add Violation'}
        </button>
      </form>
    </div>
  );
}