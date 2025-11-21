import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUserRequest } from '../../../features/header/components/models/register-user-request.model';
import { LoginUserRequest } from '../../../features/header/components/models/login-user-request.model';
import { RegisterUserResponse } from '../../../features/header/components/models/register-user-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private API_URL = environment.apiUrl;

  readonly http = inject(HttpClient);

  public registerUser(userRequest: RegisterUserRequest): Observable<RegisterUserResponse>{
    return this.http.post<RegisterUserResponse>(`${(this.API_URL)}/auth/register`, userRequest);
  }

  public authUser(loginRequest: LoginUserRequest) : Observable<void>{
    return this.http.post<void>(`${(this.API_URL)}/auth/authenticate`, loginRequest);
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${(this.API_URL)}/auth/logout`,
      null);
  }
}
