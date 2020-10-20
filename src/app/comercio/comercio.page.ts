import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParamsService } from '../services/params.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  MarkerIcon,
  Environment, GoogleMapOptions
} from '@ionic-native/google-maps/ngx';
import { LoadingService } from '../services/loading.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.page.html',
  styleUrls: ['./comercio.page.scss'],
})
export class ComercioPage implements OnInit {
  Business$: Observable<any>;
  businessId: string = '';
  locs = [];
  map: GoogleMap;
  cargando: string;
  type;

  constructor(
      private platform: Platform,
      public global: GlobalService,
      private params: ParamsService,
      private route: ActivatedRoute,
      private loading: LoadingService,
      private router: Router,
      private translate: TranslateService
  ) {}

  ngOnInit(){

  }

  ionViewWillEnter(){
    this.type = 'lista';
    this.translateTerms();
    if (this.route.snapshot.paramMap.get('businessId') != null){
      this.businessId = this.route.snapshot.paramMap.get('businessId');
    } else {
      this.businessId = this.params.getParams();
    }
    this.loadBusiness('list');
    // this.platform.ready().then(() => {
    //     if (this.platform.is('cordova')) {
    //       this.loadMap();
    //     }
    // });
  }

  loadBusiness(text: string){
    this.loading.presentLoading(this.cargando);
    this.Business$ = this.global.GetBusinessLocation(this.businessId).pipe(
      map((res: any) => {
        if (res.Code == 200) {
          this.locs = res.Business;
          if (text != 'list'){
            if (this.platform.is('cordova')) {
              for (let index in this.locs['Locations']) {
                var points = JSON.parse(this.locs['Locations'][index]['Geolocation']);
                this.addLocationMarker(points['LAT'], points['LNG'], this.locs['Locations'][index], this.locs['Imagen']);
              }
            }
          }
          this.loading.dismissLoading();
          return res.Business;
        }
        this.loading.dismissLoading();
      })
    );
  }

  segmentChanged(ev: any){
    if (ev.detail.value == 'mapa') {
      this.loadBusiness('mapa');
      this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
          this.loadMap();
        }
      });
    }
  }

  onParams(item: any, bus: any){
    let data = {
      BusinessId: bus.BusinessId,
      Name: bus.Name,
      Imagen: bus.Imagen,
      Location: item
    }
    this.params.setParams(data);
  }

  addLocationMarker(la: any, ln: any, locationObj: any, image: any){
    let icon: MarkerIcon = {
      url: './assets/icon/pin-tc247.png',
      size: {
        width: 39,
        height: 43
      }
    };
    this.map.addMarker({
      icon: icon,
      animation: 'BOUNCE',
      position: {
        lat: la,
        lng: ln,
      },
      // title: locationObj.Name,
      disableAutoPan: true,
    }).then((marker: Marker) => {
      marker.showInfoWindow();
      marker.one(GoogleMapsEvent.MARKER_CLICK).then(() => {
          let data = {
            BusinessId: locationObj.BusinessId,
            Name: locationObj.Name,
            Imagen: image,
            Location: locationObj
          };
          this.params.setParams(data);
          this.router.navigate(['/comercio-localidad']);
      });
    });
  }

  loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBdQ6vAlbIi3u_KdiMv8KILsjYExJLDUGU',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBdQ6vAlbIi3u_KdiMv8KILsjYExJLDUGU'
    });

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 18.2151152,
          lng: -66.487384
        },
        zoom: 8.4,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('CARGANDO_INFO').subscribe((res: string) => {
      this.cargando = res;
    });
  }

}


