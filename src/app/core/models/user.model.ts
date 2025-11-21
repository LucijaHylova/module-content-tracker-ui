import { UserModuleResponse } from '../../features/dashboard/models/user-module-response.model';
import { ModuleComparison } from '../../features/module-comparison/models/module-comparition.model';

export interface User {
  username: string,
  email: string,
  program: string,
  specialization: string,
  userModules: UserModuleResponse[],
  moduleComparisons: ModuleComparison[],
  totalPassedEcts: number
}


