import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuandoPageRoutingModule } from './cuando-routing.module';

import { CuandoPage } from './cuando.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {HttpLoaderFactory} from '../donde/donde.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuandoPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [CuandoPage]
})
export class CuandoPageModule {}
