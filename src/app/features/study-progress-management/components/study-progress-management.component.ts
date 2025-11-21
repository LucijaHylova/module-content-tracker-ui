import { Component, inject, OnInit } from '@angular/core';
import { AppStore } from '../../../core/stores/app.store';
import { StudyProgressComponent } from './study-progress/study-progress.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MODULE_STATUS } from '../../../shared/models/node.enum';
import { LangStore } from '../../../core/stores/lang.store';

@Component({
  selector: 'app-study-progress-management',
  imports: [
    StudyProgressComponent,
    MatButton,
    TranslatePipe
  ],
  templateUrl: './study-progress-management.component.html',
  styleUrl: './study-progress-management.component.scss'
})
export class StudyProgressManagementComponent implements OnInit {
  readonly #appStore = inject(AppStore);
  readonly #langStore = inject(LangStore);

  readonly router = inject(Router);
  lang = this.#langStore.lang;


  ngOnInit(): void {
    this.#appStore.setIsProfileView(false);
    this.#appStore.setIsOnHomePage(false);
    this.#appStore.setIsONModuleComparisonPage(false);


  }

  back() {
    this.#appStore.setFlagged(false);
    this.router.navigate(['/dashboard']);
  }

  protected readonly MODULE_STATUS = MODULE_STATUS;
}
