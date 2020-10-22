import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserGuard } from './services/user.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'donde',
    loadChildren: () => import('./donde/donde.module').then( m => m.DondePageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'cuando',
    loadChildren: () => import('./cuando/cuando.module').then( m => m.CuandoPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'categorias-detalle',
    loadChildren: () => import('./categorias-detalle/categorias-detalle.module').then( m => m.CategoriasDetallePageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'comercio/:businessId',
    loadChildren: () => import('./comercio/comercio.module').then( m => m.ComercioPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'comercio-localidad',
    loadChildren: () => import('./comercio-localidad/comercio-localidad.module').then( m => m.ComercioLocalidadPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./mensajes/mensajes.module').then( m => m.MensajesPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'registro/:email',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'verificacion',
    loadChildren: () => import('./verificacion/verificacion.module').then( m => m.VerificacionPageModule)
  },
  {
    path: 'verificacion/:path/:email',
    loadChildren: () => import('./verificacion/verificacion.module').then( m => m.VerificacionPageModule)
  },
  {
    path: 'verificacion/:path/:email/:new',
    loadChildren: () => import('./verificacion/verificacion.module').then( m => m.VerificacionPageModule)
  },
  {
    path: 'cita',
    loadChildren: () => import('./cita/cita.module').then( m => m.CitaPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'telefono',
    loadChildren: () => import('./telefono/telefono.module').then( m => m.TelefonoPageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'verifemail',
    loadChildren: () => import('./verifemail/verifemail.module').then( m => m.VerifemailPageModule)
  },
  {
    path: 'verifemail/:new',
    loadChildren: () => import('./verifemail/verifemail.module').then( m => m.VerifemailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
