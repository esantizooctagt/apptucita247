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
    console.log(this.global.Where);
    console.log(this.global.WhereLabel);
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

          let city = '';
          let region = '';
          let country = '';
          let sector = '';
          for (var i=0; i<res['results'][0].address_components.length; i++){
            if (res['results'][0].address_components[i].types[1] == "sublocality") {
              if (res['results'][0].address_components[i] != undefined || res['results'][0].address_components[i] != null){
                sector = res['results'][0].address_components[i]['long_name'];
              }
            }
            if (res['results'][0].address_components[i].types[0] == "locality") {
              city = res['results'][0].address_components[i]['long_name'];
            }
            if (res['results'][0].address_components[i].types[0] == "administrative_area_level_1") {
              region = res['results'][0].address_components[i]['long_name'];
            }
            if (res['results'][0].address_components[i].types[0] == "country") {
              country = res['results'][0].address_components[i]['long_name'];
            }
          }
          let result;
          if (sector != '') {
            result = this.Places.filter(x => x.Name === sector.toUpperCase() && x.ParentName === city.toUpperCase());
          } else {
            result = this.Places.filter(x => x.Name === city.toUpperCase());
          }
          if (result.length >= 0){
            if (result[0].Parent != ''){
              this.global.Where = result[0].Parent + ',' + result[0].City;
              this.global.WhereLabel = sector.toUpperCase();
            } else {
              this.global.Where = result[0].City + ',';
              this.global.WhereLabel = city.toUpperCase();
            }
            console.log(this.global.Where);
            console.log(this.global.WhereLabel);
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
