import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../lib/db';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../models/note';

const router = Router();
const notes = db.collection('notes');

// GET /api/notes - Get all notes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rawNotes = await notes.find();
    const notesList = rawNotes as unknown as Note[];
    // Sort by updatedAt descending (newest first)
    const sorted = notesList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    res.json({ data: sorted });
  } catch (error) {
    console.error('[routes/notes] GET / error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateNoteInput;
    
    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const now = Date.now();
    const newNote = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      content: body.content?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const insertedId = await notes.insertOne(newNote);
    const created = await notes.findById(insertedId);
    
    if (!created) {
      return res.status(500).json({ error: 'Failed to create note' });
    }

    res.status(201).json({ data: created as unknown as Note });
  } catch (error) {
    console.error('[routes/notes] POST / error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const body = req.body as UpdateNoteInput;

    if (!body.title?.trim() && !body.content?.trim()) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    const existingRaw = await notes.findById(id);
    if (!existingRaw) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const existing = existingRaw as unknown as Note;

    const updated = await notes.updateOne(id, {
      title: body.title?.trim() ?? existing.title,
      content: body.content?.trim() ?? existing.content,
      updatedAt: Date.now(),
    });

    if (!updated) {
      return res.status(500).json({ error: 'Failed to update note' });
    }

    const result = await notes.findById(id);
    res.json({ data: result as unknown as Note });
  } catch (error) {
    console.error('[routes/notes] PUT /:id error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const existing = await notes.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const deleted = await notes.deleteOne(id);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete note' });
    }

    res.json({ data: { success: true } });
  } catch (error) {
    console.error('[routes/notes] DELETE /:id error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;