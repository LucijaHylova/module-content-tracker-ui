import { UserModuleId } from './user-module-id.model';

export interface UserModuleUpdateRequest {
  id: UserModuleId;
  status?: string;
  selectedSemester?: number;
}
