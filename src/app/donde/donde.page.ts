import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-donde',
  templateUrl: './donde.page.html',
  styleUrls: ['./donde.page.scss'],
})
export class DondePage implements OnInit {
  Places: any;
  searchTerm = '';
  cargando: string;
  term: string;
  currLocation: string;

  constructor(
    public global: GlobalService,
    private geolocation: Geolocation,
    private loading: LoadingService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loading.presentLoading(this.cargando);
    this.global.GetPlaces( this.global.Country)
      .subscribe((content: any) => {
        this.Places = content.sort((a, b)=> (a.Name < b.Name ? -1: 1));
        this.loading.dismissLoading();
      });
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  setWhere(parent: string, whereValue: any, whereLabel){
     this.global.Where = (parent != '' ? parent + ',' + whereValue : whereValue + ',');
     this.global.WhereLabel = whereLabel;
     this.searchTerm = '';
     this.router.navigateByUrl('/tabs/tab1');
  }

  setWh(){
    this.loading.presentLoading(this.cargando);
    this.geolocation.getCurrentPosition().then((resp) => {
      let lat = resp.coords.latitude;
      let lng = resp.coords.longitude;
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true&key=AIzaSyBdQ6vAlbIi3u_KdiMv8KILsjYExJLDUGU';
      this.global.GetCurrentCity(url)
        .subscribe(res => {
          this.loading.dismissLoading();
          let city = res['results'][0]['address_components'][2]['long_name'];
          let sector = res['results'][0]['address_components'][1]['long_name'];
          let result = this.Places.filter(x => x.Name === sector.toUpperCase() && x.ParentName === city.toUpperCase());
          if (result.length >= 0){
            this.global.Where = result[0].Parent + ',' + result[0].City;
            this.global.WhereLabel = sector.toUpperCase();
            this.searchTerm = '';
            this.router.navigateByUrl('/tabs/tab1');
          }
      });
     }).catch((error) => {
      this.loading.dismissLoading();
       console.log('Error getting location', error);
     });
  }

  translateTerms() {
      this.translate.use(this.global.Language);

      this.translate.get('CARGANDO_INFO').subscribe((res: string) => {
          this.cargando = res;
      });

      this.translate.get('TERMINO_BUSQUEDA').subscribe((res: string) => {
          this.term = res;
      });
  }

}
