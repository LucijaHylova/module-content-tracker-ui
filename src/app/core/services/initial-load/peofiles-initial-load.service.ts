import { inject, Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import {
  ModuleCompetenceProfileStore
} from '../../../features/competence-profiles/stores/module-competence-profile.store';

import {
  ProgramCompetenceProfileStore
} from '../../../features/competence-profiles/stores/program-competence-profile.store';
import {
  DepartmentCompetenceProfileStore
} from '../../../features/competence-profiles/stores/department-competence-profile.store';
import { ModuleContentProfileStore } from '../../../features/content-profiles/stores/module-content-profile.store';
import { ContentProfileService } from '../../../features/content-profiles/services/content-profile.service';
import { CompetenceProfileService } from '../../../features/competence-profiles/services/competence-profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileInitialLoad {
  #moduleCompetenceProfileStore = inject(ModuleCompetenceProfileStore);
  #programCompetenceProfileStore = inject(ProgramCompetenceProfileStore);
  #departmentCompetenceProfileStore = inject(DepartmentCompetenceProfileStore);
  #moduleContentProfileStore = inject(ModuleContentProfileStore);

  competenceProfileService = inject(CompetenceProfileService);
  contentProfileService = inject(ContentProfileService);

  initAllContent() {
    const subject = new Subject<void>();
    forkJoin({
      moduleCompetenceProfiles: this.competenceProfileService.getModuleCompetenceProfiles(),
      moduleContentProfiles: this.contentProfileService. getModuleContentProfiles(),
      programCompetenceProfiles: this.competenceProfileService.getProgramContentCompetencies(),
      departmentCompetenceProfiles: this.competenceProfileService.getDepartmentContentCompetencies()
    }).subscribe((result) => {

      console.log('Module Competence Profiles Loaded ' + result.moduleCompetenceProfiles.length);
      console.log('Module Content Profiles Loaded ' + result.moduleContentProfiles.length);
      this.#moduleCompetenceProfileStore.setModuleCompetenceProfiles(result.moduleCompetenceProfiles);
      this.#moduleContentProfileStore.setModuleContentProfiles(result.moduleContentProfiles);

      console.log('Program Competence Profiles Loaded ' + result.programCompetenceProfiles.length);
      this.#programCompetenceProfileStore.setProgramCompetenceProfiles(result.programCompetenceProfiles);

      console.log('Department Competence Profiles Loaded ' + result.departmentCompetenceProfiles.length);
      this.#departmentCompetenceProfileStore.setDepartmentCompetenceProfiles(result.departmentCompetenceProfiles);

      subject.next();
      subject.complete();
    });
  }

}
