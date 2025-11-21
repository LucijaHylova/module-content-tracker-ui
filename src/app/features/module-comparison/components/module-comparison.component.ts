import { Component, inject, OnInit } from '@angular/core';
import { LangStore } from '../../../core/stores/lang.store';
import { AppStore } from '../../../core/stores/app.store';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ComparisonNodesComponent } from './comparison-nodes/comparison-nodes.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-module-comparison',
  imports: [
    TranslatePipe,
    ComparisonNodesComponent,
    MatButton
  ],
  templateUrl: './module-comparison.component.html',
  styleUrl: './module-comparison.component.scss'
})
export class ModuleComparisonComponent implements OnInit  {

  readonly #appStore = inject(AppStore);

  readonly router = inject(Router);
  ngOnInit(): void {

    this.#appStore.setIsProfileView(false);
    this.#appStore.setIsOnHomePage(false);
    this.#appStore.setIsONModuleComparisonPage(true);

  }

  back() {
    this.router.navigate(['/dashboard']);
  }


}
