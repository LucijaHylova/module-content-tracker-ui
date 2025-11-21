import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SimilaritySearchResponse } from '../models/similarity-search-response.model';
import { AiApi } from '../../../core/api/ai/ai-api';
import { ModuleComparison } from '../../module-comparison/models/module-comparition.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {


  readonly aiApi = inject(AiApi);

  findModulesByKeywords(keywords: string): Observable<SimilaritySearchResponse[]> {
    return this.aiApi.findModulesByKeywords(keywords);
  }


  getModuleComparisonUser(moduleCodes: string[]): Observable<ModuleComparison[]> {
    return this.aiApi.getModuleComparisonUser(moduleCodes);
  }

}
