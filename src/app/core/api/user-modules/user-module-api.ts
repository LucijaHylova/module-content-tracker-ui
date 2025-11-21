import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserModuleSelectionRequest } from '../../../features/dashboard/models/module-selection-request.model';
import { Response } from '../../../features/dashboard/models/module-selection-response.model';
import { UserUpdateRequest } from '../../../features/user-profile/models/user-update-request.model';
import { UserModuleUpdateRequest } from '../../../features/dashboard/models/user-module-update-request.model';
import { UserModuleId } from '../../../features/dashboard/models/user-module-id.model';


@Injectable({
  providedIn: 'root'
})
export class UserModuleApi {

  private API_URL = environment.apiUrl;

  readonly http = inject(HttpClient);

  public updateUserModule(userModuleUpdateRequest: UserModuleUpdateRequest): Observable<Response> {
    return this.http.put<Response>(`${this.API_URL}/userModules/me/updateUserModule`, userModuleUpdateRequest);
  }

  public addUserModule(userModuleSelectionRequest: UserModuleSelectionRequest) : Observable<Response>{
    return this.http.put<Response>(`${this.API_URL}/userModules/me/addUserModule`, userModuleSelectionRequest);
  }

  public deleteUserModule( userModuleId: UserModuleId) : Observable<Response>{
    return this.http.delete<Response>(`${this.API_URL}/userModules/me/deleteUserModule`, {
      body: userModuleId
    });
  }
}
