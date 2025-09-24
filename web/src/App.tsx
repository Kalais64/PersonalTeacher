import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import NoteDetailPage from './pages/NoteDetailPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">CogniTutor AI</Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/quiz">Quiz</Link>
            <Link to="/profile">Profile</Link>
            {user ? (
              <button onClick={signOut} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Sign out</button>
            ) : (
              <Link to="/auth" className="px-2 py-1 rounded bg-blue-600 text-white">Sign in</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
