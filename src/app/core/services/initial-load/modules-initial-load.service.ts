import { inject, Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { ModuleService } from '../../../features/dashboard/services/module.service';
import { AppStore } from '../../stores/app.store';

@Injectable({
  providedIn: 'root'
})
export class ModulesInitialLoad {
  #appStore = inject(AppStore);
  #modulesService = inject(ModuleService);


  initModules() {
    const subject = new Subject<void>();
    forkJoin({
      modules: this.#modulesService.getAll(),
    }).subscribe((result) => {
      console.log('Modules Loaded ' + result.modules.length);
      this.#appStore.setModules(result.modules);
      subject.next();
      subject.complete();
    });
    return subject;
  }

}
