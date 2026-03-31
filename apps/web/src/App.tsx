import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNoteStore } from '@/store/useNoteStore';
import NoteEditor from '@/components/NoteEditor';
import NoteGrid from '@/components/NoteGrid';

function App() {
  const { searchQuery, setSearchQuery, isEditorOpen, openEditor, closeEditor, fetchNotes, isLoading } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-3xl font-bold">Notes App</h1>
          <Button onClick={() => openEditor()} disabled={isLoading}>Add Note</Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <NoteGrid />

        {isEditorOpen && <NoteEditor onClose={closeEditor} />}
      </div>
    </div>
  );
}

export default App;