/** Тип поля */
export type FieldType =
  | 'select'
  | 'multiselect'
  | 'string'
  | 'text'
  | 'date'
  | 'numeric'
  | 'checkbox'
  | 'file';

/** Значение поля */
export type FieldValue = string | string[] | number | null;

/** Кастомное поле заказа */
export interface DealCustomField {
  id: number;
  name: string;
  value: FieldValue;
  type: FieldType;
}

/** Кастомное поле пользователя */
export interface UserCustomField {
  name: string;
  value: FieldValue;
  type: FieldType;
  units: string | null;
}

/** Кастомное поле после обновления */
export interface UpdateCustomField {
  name: string;
  value: FieldValue;
  type: FieldType;
  units: string | null;
}
