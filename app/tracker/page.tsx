"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ViolationsCount from '@/app/components/violations/ViolatoinsCount';
import SearchViolations from '@/app/components/violations/SearchViolations';
import AddViolationForm from '@/app/components/violations/AddViolationForm';
import ViolationsList from '@/app/components/violations/ViolationsList';
import { useAuth } from '@/app/lib/auth';

export default function ViolationTrackerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Violation Tracker</h1>
          <ViolationsCount />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <SearchViolations />
            </div>
            <div>
              <AddViolationForm />
            </div> 
            <div>
              <ViolationsList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}