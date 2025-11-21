import { UserModuleId } from './user-module-id.model';

export interface UserModuleSelectionRequest {
  id: UserModuleId;
  status?: string;
  selectedSemester: number;
}
