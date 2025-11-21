import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import * as echarts from 'echarts/core';

import { provideEchartsCore} from 'ngx-echarts';
import { GraphChart, ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { TitleComponent } from 'echarts/components';
import { TooltipComponent } from 'echarts/components';
import { LegendComponent } from 'echarts/components';
import { ModulesInitialLoad } from './core/services/initial-load/modules-initial-load.service';
import { ProfileInitialLoad } from './core/services/initial-load/peofiles-initial-load.service';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserService } from './features/user-profile/services/user.service';
import { UserStore } from './core/stores/user.store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { AppStore } from './core/stores/app.store';
import { DashboardStore } from './features/dashboard/stores/dashboard.store';
import { ModuleComparisonStore } from './features/module-comparison/stores/module-comparison.store';



echarts.use([
  GraphChart,
  ScatterChart,
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CSRF-TOKEN_LUCIA',
        headerName: 'x-CSRF-TOKEN_LUCIA'
      }),
      withInterceptorsFromDi()
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      }),
      defaultLanguage: 'de',
      useDefaultLang: true,
      fallbackLang: 'de'

    }),
    provideEchartsCore({ echarts }),
    provideAppInitializer(() => {
      const facade = inject(ModulesInitialLoad);
      facade.initModules();
    }),
    provideAppInitializer(() => {
      const aiFacade = inject(ProfileInitialLoad);
      aiFacade.initAllContent();
    }),
    provideAppInitializer(() => {
      const userService = inject(UserService);
      const userStore = inject(UserStore);
      const appStore = inject(AppStore);
      const dashboardStore = inject(DashboardStore);
      const moduleComparisonStore = inject(ModuleComparisonStore);

      return firstValueFrom(
        userService.getMe().pipe(

          tap(user => {
            userStore.setUser(user);
            console.log("Loaded user on app init:", user);

            appStore.setIsLoggedIn(true);
            appStore.setIsRouting(true);
            dashboardStore.setSelectedDepartment(undefined);
            dashboardStore.setSelectedProgram(undefined);
            dashboardStore.setSelectedModuleType(undefined);
            dashboardStore.setSelectedModule(undefined);
            moduleComparisonStore.setModulesComparisonResults(user.moduleComparisons);
            moduleComparisonStore.setModulesToCompare(user.moduleComparisons.map(mc => mc.code));

          }),
          catchError(err => {
            return of(null);
          })
        )
      );
    })
  ],
};
