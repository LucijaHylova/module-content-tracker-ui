import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LangStore } from '../../../core/stores/lang.store';
import { DashboardStore } from '../../../features/dashboard/stores/dashboard.store';
import { AppStore } from '../../../core/stores/app.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatButton,
    TranslatePipe,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnDestroy{

  placeholder = input<string>();
  event = output<any>();
  control = new FormControl('');
  readonly #dashboardStore = inject(DashboardStore);
  readonly #appStore = inject(AppStore);

  readonly chartOptions = this.#dashboardStore.chartOptions;

  isRouting = this.#appStore.isRouting;

  private sub = new Subscription();

  constructor() {
    this.sub.add(
      this.control.valueChanges.subscribe((value) => {
        if (value === '' || value == null) {
          this.#dashboardStore.setSimilaritySearchResults([]);
        }
      })
    );

    effect(() => {
      if (this.isRouting()) {
        this.control.setValue('', { emitEvent: false });
        this.#dashboardStore.setSimilaritySearchResults([]);
        this.#appStore.setIsRouting(false)
      }
    });
  }



  onSearch() {
    this.event.emit(this.control.value);
  }

  ngOnDestroy(): void {
    console.log('SearchComponent destroyed');
  }
}
