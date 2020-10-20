import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifemailPage } from './verifemail.page';

const routes: Routes = [
  {
    path: '',
    component: VerifemailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifemailPageRoutingModule {}
