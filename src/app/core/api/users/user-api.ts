import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Response } from '../../../features/dashboard/models/module-selection-response.model';
import { UserUpdateRequest } from '../../../features/user-profile/models/user-update-request.model';
import {
  ModuleComparisonDeleteRequest
} from '../../../features/user-profile/models/module-comparison-delete-request.model';


@Injectable({
  providedIn: 'root'
})
export class UserApi {

  private API_URL = environment.apiUrl;

  readonly http = inject(HttpClient);

  public getMe(): Observable<User>{
    return this.http.get<User>(`${(this.API_URL)}/users/me`);
  }

  public updateUser( modifyUserRequest: UserUpdateRequest): Observable<Response> {
    return this.http.put<Response>(`${this.API_URL}/users/me/updateUser`, modifyUserRequest);
  }

  public deleteUserModuleComparison(moduleComparisonDeleteRequest: ModuleComparisonDeleteRequest) : Observable<Response>{
    return this.http.delete<Response>(`${this.API_URL}/users/module-comparison/delete`, {
      body: moduleComparisonDeleteRequest
    });
  }

}
