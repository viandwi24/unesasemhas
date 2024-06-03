export interface TaskDataNote {
  image?: string;
  text?: string;
  author?: string;
}

export interface TaskData {
  description: string;
  notes: TaskDataNote[]
}