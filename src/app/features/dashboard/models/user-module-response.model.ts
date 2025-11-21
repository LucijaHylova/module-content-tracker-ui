import { i18nType } from "../../../shared/models/i18nType.model";


export interface UserModuleResponse {
  code: string;
  username: string;
  name: i18nType;
  selectedSemester: number;
  status: string;
}


