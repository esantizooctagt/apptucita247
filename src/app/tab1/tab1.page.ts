import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, IonSlides, LoadingController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { ParamsService } from '../services/params.service';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  dataSearch: string = '';
  result$: Observable<any[]>;

  termino: string;
  cargando: string;

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('searchText', {static: false}) searchbar: IonSearchbar;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 5,
    autoplay: true
  };
  isSearchBarOpened: number=0;
  Ads: any;
  PremiumBussines: any;
  loader: any = 0;

  constructor(
    public global: GlobalService,
    private router: Router,
    private params: ParamsService,
    private loading: LoadingService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // this.isSearchBarOpened = 0;
    this.translateTerms();
    // this.loadData();
  }

  ionViewWillEnter(){
    console.log("ingresa para traduccion");
    this.isSearchBarOpened = 0;
    this.translateTerms();
    this.loadData();
  }

  loadData(){
    this.global.Categories = undefined;
    this.loading.presentLoading(this.cargando);
    this.global.GetAds()
      .subscribe(content => {
        this.Ads = content['Ads'];
        // this.loading.dismissLoading();
      });
    this.global.GetPremiumBussines()
      .subscribe(content => {
        this.PremiumBussines = content['Business'];
        this.loading.dismissLoading();
      });
    this.global.GetCategories()
      .subscribe((content: any) => {
        this.global.Categories = content.sort((a, b) => (a.Qty<b.Qty)?1:-1);
        // this.loading.dismissLoading();
      });
  }

  onCategory(CategoryId, CategoryName){
    const params = [CategoryId, CategoryName];
    this.params.setParams(params);
  }

  searchResult(event: any){
    let search = event.target.value;
    this.dataSearch = search;

    let city = (this.global.Where == null || this.global.Where == '' ? '_' : this.global.Where.split(',')[0]);
    // tslint:disable-next-line:max-line-length
    let sector = (this.global.Where == null || this.global.Where == '' ? '_' : (this.global.Where.split(',')[1] == '' ? '_' : this.global.Where.split(',')[1]));
    if (city != '' && city != '_') {
      city =  city.replace('CITY#', '');
    }
    if (sector != '' && sector != '_'){
      sector = sector.replace('SECTOR#', '');
    }
    if (search != ''){
      this.result$ = this.global.GetSearchData(search, city, sector).pipe(
        map((res: any) => {
          return res.hits.hit;
        }),
        catchError(err => {
          return 'Error !!!';
        })
      );
    }
  }

  listResult(itemId: string, subItem: string, itemNameES: string, itemNameEN: string){
    let itemName;
    if (itemId.substring(0,3) =='CAT'){
      if (this.global.Language == "ES"){
        itemName = itemNameES;
      } else {
        itemName = itemNameEN;
      }
      let subValue = (subItem.substring(0,3) == 'SUB' ? subItem.replace('SUB#', '') : '_');
      this.params.setParams([itemId.replace('CAT#', ''), itemName, subValue]);
      this.isSearchBarOpened = 0;
      this.dataSearch = '';
      this.searchbar.value = null;
      this.router.navigate(['/categorias-detalle']);
    } else {
      this.isSearchBarOpened = 0;
      this.dataSearch = '';
      this.searchbar.value = null;
      this.router.navigate(['/comercio' , itemId.replace('BUS#', '')]);
    }
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    console.log(this.global.Language);
    this.translate.get('CARGANDO_INFO').subscribe((res: string) => {
      this.cargando = res;
    });
    this.translate.get('TERMINO_BUSQUEDA').subscribe((res: string) => {
      this.termino = res;
    });
  }

  onCancel(event){
    // console.log(event);
    // console.log(this.isSearchBarOpened);
    this.isSearchBarOpened = 0;
    // console.log(this.isSearchBarOpened);
  }
}
