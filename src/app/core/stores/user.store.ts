import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/user.model';
import { ModuleResponse } from '../../shared/models/module-response.model';
import { computed, inject } from '@angular/core';
import { AppStore } from './app.store';
import { MODULE_TYPE } from '../../shared/models/node.enum';

interface UserState {
  user: User;
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({
    user: {} as User,
  }),

  withComputed((store) => {
    const appStore = inject(AppStore)

    return {
      availableUserModules: computed(() => {
        const modules = appStore.modules();
        const user = store.user();
        let userModules: ModuleResponse[] = [];
        const programModules = modules
          .filter((mr) => mr.program.de === user.program)
        const electiveModules = modules
          .filter((mr) => mr.moduleType.de === MODULE_TYPE.WAHLMODUL.de)

        userModules = [...programModules, ...electiveModules];
        return Array.from(new Set(userModules)).sort() as ModuleResponse[];

      }),
    };
  }),

  withMethods((store) => ({
    setUser(user: User  ) {
      patchState(store, { user: user });
    },
    setUserSpecialization(specialization: string) {
      const currentUser = store.user();
      const updatedUser = { ...currentUser, specialization: specialization };
      patchState(store, { user: updatedUser });
    },
    setTotalPassedEcts (totalPassedEcts: number) {
      const currentUser = store.user();
      const updatedUser = { ...currentUser, totalPassedEcts: totalPassedEcts };
      patchState(store, { user: updatedUser });
    },

  })));




