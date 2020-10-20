import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DondePage } from './donde.page';

const routes: Routes = [
  {
    path: '',
    component: DondePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DondePageRoutingModule {}
