import Link from 'next/link';
import Header from '@/app/components/Header';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">License Plate Violation Tracker</h1>
          <p className="text-lg mb-8">
            Track and manage license plate violations efficiently.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Violation Tracker</h2>
            <p className="mb-6">
              This application helps you track license plate violations by recording each occurrence 
              and maintaining a count of violations per license plate.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/login" 
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
              >
                Login
              </Link>
              <Link 
                href="/tracker" 
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
              >
                Go to Tracker
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}