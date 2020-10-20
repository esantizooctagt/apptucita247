import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComercioLocalidadPage } from './comercio-localidad.page';

const routes: Routes = [
  {
    path: '',
    component: ComercioLocalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComercioLocalidadPageRoutingModule {}
