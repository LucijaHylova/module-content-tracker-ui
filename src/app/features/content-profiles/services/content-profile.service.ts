import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleContentProfile } from '../models/module-content-profile.model';
import { ContentProfilesApi } from '../../../core/api/content-profiles/content-profiles-api.';



@Injectable({
  providedIn: 'root'
})
export class ContentProfileService {

  readonly contentProfilesApi = inject(ContentProfilesApi);


  getModuleContentProfiles(): Observable<ModuleContentProfile[]> {
    return this.contentProfilesApi.getModuleContentProfiles();
  }
}
