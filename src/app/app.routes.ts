import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    pathMatch: 'full',
    title: 'Home',
    async loadComponent() {
      const c = await import('./features/dashboard/components/dashboard.component');
      return c.DashboardComponent;
    }
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'competence-profile/:id',
    title: 'Competence Profile',
    async loadComponent() {
      const c = await import('./features/competence-profiles/competence-profile.component');
      return c.CompetenceProfileComponent;
    }
  },
  {
    path: 'content-profile/:id',
    title: 'Competen ce Profile',
    async loadComponent() {
      const c = await import('./features/content-profiles/content-profile.component');
      return c.ContentProfileComponent;
    }
  },
  {
    path: 'user-profile/me',
    title: 'User Profile',
    async loadComponent() {
      const c = await import('./features/user-profile/components/user-profile.component');
      return c.UserProfileComponent;
    }
  },
  {
    path: 'study-progress',
    title: 'Study Progress',
    async loadComponent() {
      const c = await import('./features/study-progress-management/components/study-progress-management.component');
      return c.StudyProgressManagementComponent;
    }
  },
  {
    path: 'module-comparison',
    title: 'Module Comparison',
    async loadComponent() {
      const c = await import('./features/module-comparison/components/module-comparison.component');
      return c.ModuleComparisonComponent;
    }
  }
];
