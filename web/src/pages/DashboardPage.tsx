import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Trophy, Flame, Calendar, BookOpen, Plus, Trash2, Bot, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  text: string;
  createdAt: Date;
}

const learningData = [
  { subject: 'Math', percentage: 85, target: 90 },
  { subject: 'History', percentage: 60, target: 80 },
  { subject: 'Coding', percentage: 92, target: 95 },
  { subject: 'English', percentage: 75, target: 85 },
  { subject: 'Science', percentage: 45, target: 70 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Selesaikan modul 1', completed: false },
    { id: '2', text: 'Review catatan', completed: true },
    { id: '3', text: 'Lihat video minggu ini', completed: false },
    { id: '4', text: 'Kerjakan quiz', completed: false },
  ]);
  
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', text: 'Belajar tentang integral parsial', createdAt: new Date('2024-01-20') },
    { id: '2', text: 'Review konsep OOP di JavaScript', createdAt: new Date('2024-01-22') },
  ]);
  
  const [newNote, setNewNote] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showAIAssist, setShowAIAssist] = useState(false);
  
  const currentLevel = 'Intermediate';
  const levelProgress = 65; // percentage to next level
  const streakDays = 7;
  const activeDays = ['Sabtu', 'Minggu'];
  
  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        createdAt: new Date()
      };
      setNotes(prev => [note, ...prev]);
      setNewNote('');
    }
  };
  
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false
      };
      setChecklist(prev => [...prev, newItem]);
      setNewChecklistItem('');
    }
  };
  
  const generateAIChecklist = () => {
    // Simulate AI-generated checklist items
    const aiSuggestions = [
      'Review previous chapter notes',
      'Practice 10 math problems',
      'Watch supplementary video',
      'Take practice quiz',
      'Summarize key concepts'
    ];
    
    const randomSuggestions = aiSuggestions.slice(0, 3).map(text => ({
      id: Date.now().toString() + Math.random(),
      text,
      completed: false
    }));
    
    setChecklist(prev => [...prev, ...randomSuggestions]);
    setShowAIAssist(false);
  };
  
  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };
  
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📊 Learning Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" /> 👤 Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.displayName || 'User'}</p>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Level Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" /> ⭐ Level
          </h2>
          <div className="space-y-3">
            <p className="text-lg">Current Level: <span className="font-bold text-blue-600">{currentLevel}</span></p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{levelProgress}% menuju next level</p>
          </div>
        </div>

        {/* Streak Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" /> 🔥 Streak
          </h2>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-orange-600">{streakDays} days</p>
            <p className="text-gray-600">streak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> ✅ Checklist (To Do)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAIAssist(!showAIAssist)}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="AI Suggestions"
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>
          </h2>
          
          {/* Add New Item */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
              placeholder="Add new task..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addChecklistItem}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* AI Suggestions */}
          {showAIAssist && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Bot className="w-4 h-4" /> AI Suggestions
                </h3>
                <button
                  onClick={generateAIChecklist}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Generate Tasks
                </button>
              </div>
              <p className="text-sm text-blue-600">Click "Generate Tasks" to get AI-suggested learning activities</p>
            </div>
          )}
          
          {/* Checklist Items */}
          <div className="space-y-3">
            {checklist.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={() => setChecklist(prev => prev.filter(i => i.id !== item.id))}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> 🗓️ Schedule
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700">Komit belajar 2 hari per minggu</p>
            <div>
              <p className="font-semibold">Hari aktif:</p>
              <div className="flex gap-2 mt-2">
                {activeDays.map(day => (
                  <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="h-8 w-8 flex items-center justify-center text-xs font-medium bg-gray-100 rounded">
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
        
        {/* Add Note */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
            placeholder="Add a new note..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>
        
        {/* Notes List */}
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div 
                onClick={() => handleNoteClick(note.id)}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 hover:text-blue-600">{note.text}</p>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  {note.createdAt.toLocaleDateString('id-ID')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-gray-500 text-center py-8">No notes yet. Create your first note!</p>
          )}
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Learning Progress Percentage per Subject</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis 
                label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }} 
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'percentage' ? 'Current Progress' : 'Target'
                ]} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Current Progress"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">Progress Overview:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {learningData.map(item => (
              <div key={item.subject} className="text-center">
                <div className="font-semibold">{item.subject}</div>
                <div className={`text-lg ${
                  item.percentage >= item.target ? 'text-green-600' : 
                  item.percentage >= item.target * 0.8 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {item.percentage}%
                </div>
                <div className="text-xs text-gray-500">Target: {item.target}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
