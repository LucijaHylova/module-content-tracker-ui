import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimilaritySearchResponse } from '../../../features/dashboard/models/similarity-search-response.model';
import { ModuleComparison } from '../../../features/module-comparison/models/module-comparition.model';


@Injectable({
  providedIn: 'root'
})
export class AiApi {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public findModulesByKeywords(query: string): Observable<SimilaritySearchResponse[]>{
    return this.http.get<SimilaritySearchResponse[]>(`${(this.API_URL)}/ai/findByKeywords`,  { params: { query } });
  }

  public getModuleComparisonUser(codes: string[]): Observable<ModuleComparison[]> {
    return this.http.get<ModuleComparison[]>(`${this.API_URL}/ai/compare/analysis`, { params:{ codes }});
  }

}
