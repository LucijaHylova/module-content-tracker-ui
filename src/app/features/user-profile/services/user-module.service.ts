import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModuleSelectionRequest } from '../../dashboard/models/module-selection-request.model';
import { Response } from '../../dashboard/models/module-selection-response.model';
import { UserModuleId } from '../../dashboard/models/user-module-id.model';
import { UserModuleApi } from '../../../core/api/user-modules/user-module-api';
import { UserModuleUpdateRequest } from '../../dashboard/models/user-module-update-request.model';


@Injectable({
  providedIn: 'root'
})
export class UserModuleService {

  readonly userModuleApi = inject(UserModuleApi);


  addUserModule(userModuleSelectionRequest: UserModuleSelectionRequest): Observable<Response> {
    return this.userModuleApi.addUserModule(userModuleSelectionRequest);
  }

  deleteUserModule(userModuleId : UserModuleId): Observable<Response> {
    return this.userModuleApi.deleteUserModule(userModuleId);
  }

  updateUserModule(userModuleUpdateRequest: UserModuleUpdateRequest): Observable<Response> {
    return this.userModuleApi.updateUserModule(userModuleUpdateRequest);
  }
}

