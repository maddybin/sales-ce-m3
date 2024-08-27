import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'popup',
    loadChildren: () => import('./modules/popup/popup.routes').then((c) => c.routes)
  }
]
