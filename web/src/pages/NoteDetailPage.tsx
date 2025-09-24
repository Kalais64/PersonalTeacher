import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data - in real app this would come from your backend/state management
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Belajar tentang integral parsial',
    content: `Integral parsial adalah teknik integrasi yang digunakan untuk mengintegralkan hasil kali dua fungsi.

Formula dasar:
∫ u dv = uv - ∫ v du

Langkah-langkah:
1. Pilih u dan dv dari integrand
2. Hitung du dan v
3. Substitusikan ke formula
4. Selesaikan integral yang tersisa

Contoh:
∫ x ln(x) dx

Pilih: u = ln(x), dv = x dx
Maka: du = 1/x dx, v = x²/2

Hasil: ∫ x ln(x) dx = (x²/2) ln(x) - ∫ (x²/2)(1/x) dx
     = (x²/2) ln(x) - ∫ x/2 dx
     = (x²/2) ln(x) - x²/4 + C`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Review konsep OOP di JavaScript',
    content: `Object-Oriented Programming (OOP) dalam JavaScript menggunakan prototype dan class syntax.

Konsep Utama:
1. Encapsulation - Menyembunyikan detail implementasi
2. Inheritance - Pewarisan sifat dari parent class
3. Polymorphism - Satu interface, banyak implementasi
4. Abstraction - Menyederhanakan kompleksitas

Class Syntax (ES6+):
\`\`\`javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    return \`\${this.name} is studying\`;
  }
}
\`\`\`

Prototype-based:
\`\`\`javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};
\`\`\``,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
];

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    // In real app, fetch note by ID from your backend
    const foundNote = mockNotes.find(n => n.id === id);
    if (foundNote) {
      setNote(foundNote);
      setEditTitle(foundNote.title);
      setEditContent(foundNote.content);
    }
  }, [id]);

  const handleSave = () => {
    if (note) {
      // In real app, save to backend
      const updatedNote = {
        ...note,
        title: editTitle,
        content: editContent,
        updatedAt: new Date()
      };
      setNote(updatedNote);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
    setIsEditing(false);
  };

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-3xl font-bold border-none outline-none focus:ring-0 p-0"
              placeholder="Note title..."
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Write your note content here..."
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{note.title}</h1>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {note.content}
              </pre>
            </div>
          </div>
        )}
        
        {/* Meta Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Created: {note.createdAt.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>Last updated: {note.updatedAt.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </div>
  );
}