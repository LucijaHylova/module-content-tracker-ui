import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ModuleResponse } from '../../../shared/models/module-response.model';
import { ModuleApi } from '../../../core/api/modules/module-api';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {


  readonly moduleApi = inject(ModuleApi);

  getAll(): Observable<ModuleResponse[]> {
    return this.moduleApi.getAll();
  }
}
