import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../../../shared/models/module-response.model';


@Injectable({
  providedIn: 'root'
})
export class ModuleApi {

  private API_URL = environment.apiUrl;

  readonly http = inject(HttpClient);

  public getAll(): Observable<ModuleResponse[]>{
    return this.http.get<ModuleResponse[]>(`${(this.API_URL)}/modules/all`);
  }

}
