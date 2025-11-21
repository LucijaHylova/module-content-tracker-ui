import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleCompetenceProfile } from '../../../features/competence-profiles/models/module-competence-profile.model';
import {
  ProgramCompetenceProfile
} from '../../../features/competence-profiles/models/program-competence-profile.model';
import {
  DepartmentCompetenceProfile
} from '../../../features/competence-profiles/models/department-competence-profile.model';
import { ModuleContentProfile } from '../../../features/content-profiles/models/module-content-profile.model';


@Injectable({
  providedIn: 'root'
})
export class ContentProfilesApi {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getModuleCompetenceProfiles(): Observable<ModuleCompetenceProfile[]>{
    return this.http.get<ModuleCompetenceProfile[]>(`${(this.API_URL)}/content/getModuleCompetenceProfiles`);
  }

  public getModuleContentProfiles(): Observable<ModuleContentProfile[]>{
    return this.http.get<ModuleContentProfile[]>(`${(this.API_URL)}/content/getModuleContentProfiles`);
  }

  public getProgramContentCompetencies(): Observable<ProgramCompetenceProfile[]> {
    return this.http.get<ProgramCompetenceProfile[]>(`${(this.API_URL)}/content/getProgramCompetenceProfiles`);
  }

  public getDepartmentContentCompetencies(): Observable<DepartmentCompetenceProfile[]> {
    return this.http.get<DepartmentCompetenceProfile[]>(`${(this.API_URL)}/content/getDepartmentCompetenceProfiles`);
  }


}
