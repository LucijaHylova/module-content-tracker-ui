import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Lang } from '../../shared/models/lang-model';

export interface LangState {
  lang: Lang;
}

export const LangStore = signalStore(
  { providedIn: 'root' },
  withState<LangState>({
    lang: Lang.DE,
  }),

  withComputed((store) => {

    return {
      langs: computed(() => ['de', 'en']),
    };
  }),

  withMethods((store) => ({
    setLang(lang: Lang) {
      patchState(store, { lang: lang });
    },
  }))
);




