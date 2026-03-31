import { create } from 'zustand';
import type { Note } from '@/types/note';
import { api } from '@/lib/api';

interface NoteState {
  notes: Note[];
  searchQuery: string;
  editingNote: Note | null;
  isEditorOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setEditingNote: (note: Note | null) => void;
  openEditor: (note?: Note) => void;
  closeEditor: () => void;
  getFilteredNotes: () => Note[];
}

export const useNoteStore = create<NoteState>()((set, get) => ({
  notes: [],
  searchQuery: '',
  editingNote: null,
  isEditorOpen: false,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<{ data: Note[] }>('/notes');
      set({ notes: data, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch notes', isLoading: false });
    }
  },

  addNote: async (title, content) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ data: Note }>('/notes', { title, content });
      set((state) => ({ 
        notes: [data, ...state.notes], 
        isLoading: false 
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to add note', isLoading: false });
    }
  },

  updateNote: async (id, title, content) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put<{ data: Note }>(`/notes/${id}`, { title, content });
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? data : note)),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update note', isLoading: false });
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete note', isLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setEditingNote: (note) => {
    set({ editingNote: note });
  },

  openEditor: (note) => {
    set({ isEditorOpen: true, editingNote: note || null });
  },

  closeEditor: () => {
    set({ isEditorOpen: false, editingNote: null });
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  },
}));