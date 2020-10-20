import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuandoPage } from './cuando.page';

const routes: Routes = [
  {
    path: '',
    component: CuandoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuandoPageRoutingModule {}
