
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  input,
  computed, signal, output, effect
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-selector',
  imports: [
    CommonModule, MatFormFieldModule, MatSelectModule, MatAutocomplete, MatInput, ReactiveFormsModule, MatAutocompleteTrigger
  ],

  templateUrl: './selector.component.html',

  styleUrl: './selector.component.scss'
})
export class SelectorComponent implements  OnInit {
  options = input<string[]>([]);
  value = input<string | undefined>();
  placeholder = input<string>();
  disabled = input(false);
  resetEmitter = input<any>();
  useAutocomplete = input<boolean>(true);
  eventOnSelected = output<any>();

  width = input<string>();
  requireSelection = input<boolean>(false);


  eventOnChange = new EventEmitter<any>();

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  control = new FormControl<string | undefined>('');
  private controlValue = signal<string>('');

  constructor() {
    effect(() => {
      if (this.value() === undefined || this.value() === null || this.value() === '') {
        this.control.reset();
      }
      this.disabled()
        ? this.control.disable({ emitEvent:false })
        : this.control.enable({ emitEvent:false });
    });

  }

  filteredOptions = computed(() => {
    const search = this.controlValue().toLowerCase();
    return this.options().filter(opt => opt.toLowerCase().includes(search));
  });


  ngOnInit() {
    this.control.setValue(this.value());
    if (this.resetEmitter) {
      this.resetEmitter()?.subscribe(() => this.doReset());

    }

    this.control.valueChanges.subscribe(val => {
        this.controlValue.set(val ?? '');
        this.eventOnChange.emit(val);
    });

  }

  onFocus() {
    this.autocomplete.openPanel();
  }

  onOptionSelected(event: any) {
    this.eventOnSelected.emit(event);
  }

  private doReset() {
    this.control.reset();
  }

}
