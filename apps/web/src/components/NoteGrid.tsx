import { useNoteStore } from '@/store/useNoteStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NoteGridProps {}

export default function NoteGrid({}: NoteGridProps) {
  const { searchQuery, getFilteredNotes, openEditor, deleteNote } = useNoteStore();
  const filteredNotes = getFilteredNotes();

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {searchQuery ? 'No notes match your search.' : 'No notes yet. Add one to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredNotes.map((note) => (
        <Card key={note.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{note.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm line-clamp-3 whitespace-pre-wrap">
              {note.content || 'No content'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditor(note)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteNote(note.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}