import { i18nType } from '../../../shared/models/i18nType.model';

export interface ModuleComparison {
 code: string;
 name : i18nType;

  differences_de: string[];
  differences_en: string[];

  similarities_de: string[];
  similarities_en: string[];
}

