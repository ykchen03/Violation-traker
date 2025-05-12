import Header from '@/app/components/Header';
import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}