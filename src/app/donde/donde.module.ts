import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DondePageRoutingModule } from './donde-routing.module';
import { DondePage } from './donde.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PipesModule } from '../services/pipes.module';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DondePageRoutingModule,
        Ng2SearchPipeModule,
        PipesModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [DondePage]
})
export class DondePageModule {}
