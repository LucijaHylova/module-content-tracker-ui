import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleCompetenceProfile } from '../models/module-competence-profile.model';
import { ProgramCompetenceProfile } from '../models/program-competence-profile.model';
import { DepartmentCompetenceProfile } from '../models/department-competence-profile.model';
import { ContentProfilesApi } from '../../../core/api/content-profiles/content-profiles-api.';



@Injectable({
  providedIn: 'root'
})
export class CompetenceProfileService {

  readonly competenceProfileService = inject(ContentProfilesApi);

  getModuleCompetenceProfiles(): Observable<ModuleCompetenceProfile[]> {
    return this.competenceProfileService.getModuleCompetenceProfiles();
  }


  getProgramContentCompetencies(): Observable<ProgramCompetenceProfile[]> {
    return this.competenceProfileService.getProgramContentCompetencies();
  }

  getDepartmentContentCompetencies(): Observable<DepartmentCompetenceProfile[]> {
    return this.competenceProfileService.getDepartmentContentCompetencies();
  }

}
