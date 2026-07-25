/** Тренинг */
export interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  lesson_count: number;
}

/** Группа пользователей */
export interface Group {
  id: number;
  name: string;
}
