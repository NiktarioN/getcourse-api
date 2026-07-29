/**
 * Общие настройки поля анкеты
 *
 * Приходят не во всех анкетах: в старых формах этих ключей нет
 */
interface SurveyFieldSettingsBase {
  /** Заголовок колонки в таблице ответов. Обычно пустая строка */
  table_title?: string;
  /** Выделять ли поле как важное */
  is_important?: boolean;
}

/** Общая часть поля анкеты */
interface SurveyFieldBase {
  /** Он же ключ в `SurveyAnswer.values`, но там строкой */
  id: number;
  label: string;
  required: boolean;
  description: string;
  html_block: string;
  html_block_position: string;
  show_in_table: boolean;
  hide_filled: boolean;
  /** Флаг скрытия поля. Приходит строкой, например: "0" */
  hide: string;
}

/** Однострочное поле */
export interface SurveyStringField extends SurveyFieldBase {
  type: 'string';
  settings: SurveyFieldSettingsBase & {
    /** Ширина поля в символах, например "50". Бывает пустой строкой */
    size: string;
    placeholder: string;
  };
}

/** Многострочное поле */
export interface SurveyTextField extends SurveyFieldBase {
  type: 'text';
  settings: SurveyFieldSettingsBase & {
    placeholder: string;
    /** Ширина в символах, например "49" */
    cols: string;
    /** Высота в строках, например "3" */
    rows: string;
  };
}

/** Галочка */
export interface SurveyCheckboxField extends SurveyFieldBase {
  type: 'checkbox';
  settings: SurveyFieldSettingsBase & {
    /** Ширина в символах, например 49. У галочки число, у многострочного поля строка */
    cols: string | number;
    /** Высота в строках, например 3. У галочки число, у многострочного поля строка */
    rows: string | number;
  };
}

/** Выпадающий список */
export interface SurveySelectField extends SurveyFieldBase {
  type: 'select';
  settings: SurveyFieldSettingsBase & {
    /** Варианты ответа через `\n`, например "Онлайн\nОчно\nПока не решил" */
    valueList: string;
    /** Показывать ли все варианты сразу */
    showAllValues: boolean;
    /** Текст для незаполненного значения */
    emptyValueText: string;
  };
}

/** Множественный выбор */
export interface SurveyMultiSelectField extends SurveyFieldBase {
  type: 'multi_select';
  settings: SurveyFieldSettingsBase & {
    /** Варианты ответа через `\n`, например "Онлайн\nОчно\nПока не решил" */
    valueList: string;
  };
}

/** Числовое поле */
export interface SurveyNumericField extends SurveyFieldBase {
  type: 'numeric';
  settings: SurveyFieldSettingsBase & {
    /** Ширина поля в символах, например "50". Бывает пустой строкой */
    size: string;
    placeholder: string;
    /** Единица измерения рядом с полем, например "кг". Бывает пустой строкой */
    units: string;
  };
}

/** Поле с датой */
export interface SurveyDateField extends SurveyFieldBase {
  type: 'date';
  settings: SurveyFieldSettingsBase & {
    /** Ширина поля в символах, например "50". Бывает пустой строкой */
    size: string;
    placeholder: string;
  };
}

/** Загрузка файла */
export interface SurveyFileField extends SurveyFieldBase {
  type: 'file';
  settings: SurveyFieldSettingsBase & {
    /** Приходит строкой "1", назначение не задокументировано */
    s: string;
    /** Ширина превью. В выборке всегда пустая строка */
    width: string;
    /** Высота превью. В выборке всегда пустая строка */
    height: string;
  };
}

/** Поле анкеты */
export type SurveyField =
  | SurveyStringField
  | SurveyTextField
  | SurveyCheckboxField
  | SurveySelectField
  | SurveyMultiSelectField
  | SurveyNumericField
  | SurveyDateField
  | SurveyFileField;

/** Тип поля анкеты */
export type SurveyFieldType = SurveyField['type'];

/** Форма анкеты */
interface SurveyCustomForm {
  fields: SurveyField[];
}

/** Анкета */
export interface Survey {
  id: number;
  /** Название анкеты, например "Анкета предзаписи" */
  title: string;
  customForm: SurveyCustomForm;
}

/** Ответ пользователя на анкету */
export interface SurveyAnswer {
  id: number;
  /** Дата отправки в формате "2026-01-15 09:34:01" */
  created_at: string;
  /** Дата изменения в формате "2026-01-15 09:34:01" */
  updated_at: string;
  survey: Survey;
  /** Поля анкеты. Дублируют `survey.customForm.fields` */
  fields: SurveyField[];
  /**
   * Ответы: ключ — `id` поля строкой, значение всегда строка
   *
   * Ключа нет, если поле оставили пустым. Формат зависит от типа поля:
   * `multi_select` — варианты через ", ", `date` — "19.01.2024",
   * `file` — HTML со ссылкой на загруженный файл
   */
  values: Record<string, string | undefined>;
}
