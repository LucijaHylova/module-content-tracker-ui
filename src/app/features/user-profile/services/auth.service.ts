import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUserRequest } from '../../header/components/models/register-user-request.model';

import { LoginUserRequest } from '../../header/components/models/login-user-request.model';
import { RegisterUserResponse } from '../../header/components/models/register-user-response.model';
import { AuthApi } from '../../../core/api/auth/auth-api';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly authApi = inject(AuthApi);

  registerUser(userRequest: RegisterUserRequest): Observable<RegisterUserResponse> {
    return this.authApi.registerUser(userRequest);
  }

  authUser(loginRequest: LoginUserRequest): Observable<void> {
    return this.authApi.authUser(loginRequest);
  }

  logout(): Observable<void> {
    return this.authApi.logout();
  }
}
