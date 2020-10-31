import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private global: GlobalService,
    private deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    private oneSignal: OneSignal,
    private iap: InAppBrowser
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.global.PlayerId = "";
    this.setupLanguage();
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.setupOneSignal();
      if (this.platform.is('cordova')) {
          this.setupDeepLinks();
      }
      this.global.GetLastVersion()
        .subscribe(content => {
            if (content['Code'] == 200) {
                if (content['Version'] != this.global.LocalVersion) {
                    this.openUrls();
                }
            }
        });
    });
  }

  setupDeepLinks(){
    this.deeplinks.route({
      '/comercio/:businessId': 'comercio'
    }).subscribe((match) =>{
      const internalPath = `/${match.$route}/${match.$args['businessId']}`;
      this.zone.run(() => {
        this.router.navigateByUrl(internalPath);
      });
    }, (nomatch) => {
      console.log('Got a deeplink that didn\'t match ' + nomatch.toString());
    });
  }

  setupLanguage(){
    if (window.Intl && typeof window.Intl === 'object') {
      if (navigator.language.toLowerCase().substring(0,2) == 'en'){
        this.global.Language = 'en';
      } else {
        this.global.Language = 'es';
      }
    } else {
      this.global.Language = 'en';
    }
    let user = this.global.GetCustomerInfo();
    if (user != undefined){
      if (user.Language != this.global.Language){
        this.global.SetLanguage(user.Mobile, user.CustomerId, this.global.Language)
          .subscribe((content: any) => {
            if (content.Code == 200){
              user.Language = this.global.Language;
              window.localStorage.customer = JSON.stringify(user);
              console.log("change language");
            }
          });
      }
    }
  }

  setupOneSignal(){
    this.oneSignal.startInit('476a02bb-38ed-43e2-bc7b-1ded4d42597f', '325907828603');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
    // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
      this.router.navigateByUrl('tabs/tab2');
    });
    this.oneSignal.endInit();

    this.oneSignal.getIds().then(identity => {
      this.global.PlayerId = identity.userId;
    });
  }

  openUrls(){
      if (this.platform.is('ios')) {
          this.iap.create('https://www.apple.com/la/ios/app-store/');
      } else if (this.platform.is('android')) {
          this.iap.create('https://play.google.com/store');
      }
  }
}
