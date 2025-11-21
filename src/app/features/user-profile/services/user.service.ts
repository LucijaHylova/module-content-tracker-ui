import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UserApi } from '../../../core/api/users/user-api';
import { Response } from '../../dashboard/models/module-selection-response.model';
import { UserUpdateRequest } from '../models/user-update-request.model';
import { ModuleComparisonDeleteRequest } from '../models/module-comparison-delete-request.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly userApi = inject(UserApi);

  getMe(): Observable<User> {
    return this.userApi.getMe();
  }

  updateUser(userUpdateRequest: UserUpdateRequest): Observable<Response> {
    return this.userApi.updateUser(userUpdateRequest);
  }

  deleteUserModuleComparison(moduleComparisonDeleteRequest: ModuleComparisonDeleteRequest): Observable<Response> {
    return this.userApi.deleteUserModuleComparison(moduleComparisonDeleteRequest);
  }
}

