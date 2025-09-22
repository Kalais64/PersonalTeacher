import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const { user, signInWithGoogle } = useAuth();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      {user ? (
        <p className="text-green-700">You are signed in.</p>
      ) : (
        <button onClick={signInWithGoogle} className="px-4 py-2 rounded bg-blue-600 text-white">Continue with Google</button>
      )}
    </section>
  );
}
