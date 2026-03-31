export interface Note {
  _id: string;
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type CreateNoteInput = {
  title: string;
  content: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};