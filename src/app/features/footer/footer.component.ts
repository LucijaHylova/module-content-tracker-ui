import { Component, inject, OnInit } from '@angular/core';
import { SelectorComponent } from '../../shared/ui/selector/selector.component';
import { LangStore } from '../../core/stores/lang.store';

import { MatSelectChange } from '@angular/material/select';
import { AppStore } from '../../core/stores/app.store';
import { Language, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardStore } from '../dashboard/stores/dashboard.store';
import { Lang } from '../../shared/models/lang-model';
import { CATEGORY } from '../../shared/models/node.enum';


@Component({
  selector: 'app-footer',
  imports: [
    SelectorComponent,
    TranslatePipe
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);
  readonly #dashboardStore = inject(DashboardStore);

  readonly #translateService = inject(TranslateService);

 selectedLang = this.#langStore.lang;
 langs = this.#langStore.langs;
 isProfileView= this.#appStore.isProfileView;

  onLangChange(lang: MatSelectChange) {
    const currentLang = lang.value as Lang;

    const selected = {
      [CATEGORY.MODULE[currentLang]]: true,
      [CATEGORY.PROGRAM[currentLang]]: false,
      [CATEGORY.DEPARTMENT[currentLang]]: false,
      [CATEGORY.RESPONSIBILITY[currentLang]]: false,
      [CATEGORY.MODULE_TYPE[currentLang]]: false,
    };
    this.#langStore.setLang(lang.value as Lang);
    this.#translateService.use(lang.value as Language);
    this.#dashboardStore.setSelectedModule(undefined);
    this.#dashboardStore.setSelectedDepartment(undefined);
    this.#dashboardStore.setSelectedProgram(undefined);
    this.#dashboardStore.setSelectedModuleType(undefined);
    this.#dashboardStore.setLegendSelection(selected);

  }

  ngOnInit(): void {
  }

  protected readonly Lang = Lang;
}
