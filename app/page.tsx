"use client";
import Header from '@/app/components/Header';
import ViolationsCount from '@/app/components/violations/ViolatoinsCount';
import SearchViolations from '@/app/components/violations/SearchViolations';
import AddViolationForm from '@/app/components/violations/AddViolationForm';

export default function ViolationTrackerPage() {

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
          </div>
        </div>
      </main>
    </div>
  );
}