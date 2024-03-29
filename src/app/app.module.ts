import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DatePicker } from '@ionic-native/date-picker/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ThemeDetection } from '@ionic-native/theme-detection/ngx';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgxQRCodeModule,
        Ng2SearchPipeModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        InAppBrowser,
        StatusBar,
        SplashScreen,
        DatePicker,
        DatePipe,
        OneSignal,
        BackgroundMode,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Camera,
        File,
        WebView,
        FilePath,
        Deeplinks,
        GoogleAnalytics,
        Geolocation,
        ThemeDetection
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
