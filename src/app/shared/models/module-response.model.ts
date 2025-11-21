import { i18nType } from './i18nType.model';

export interface ModuleResponse {
  code: string;
  name: i18nType;
  department: i18nType;
  program: i18nType;
  ects: number;
  responsibility: i18nType;
  moduleType: i18nType;
  semesters: number[];
  specialization: i18nType;
}


