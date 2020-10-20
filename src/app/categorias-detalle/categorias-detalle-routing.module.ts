import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasDetallePage } from './categorias-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriasDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasDetallePageRoutingModule {}
