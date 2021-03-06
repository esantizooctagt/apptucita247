import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { ParamsService } from '../services/params.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {
  Favorites$: Observable<any>;
  DelFavorite$: Observable<any>;
  fav = -1;
  conection = 0;
  lan: string = '';
  cargando: boolean = true;
  favorites: any[]=[];

  cargandoFavorito: string;
  elmininadoFavorito: string;
  constructor(
    public global: GlobalService,
    public loading: LoadingService,
    private params: ParamsService,
    private translate: TranslateService,
    private ga: GoogleAnalytics
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.lan = this.global.Language;
    this.translateTerms();
    this.GetFavorites();
    this.ga.trackView('Favoritos Page').then(res => {
      console.log("Registro Page");
    })
    .catch(e => console.log(e));
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

  GetFavorites(){
    this.conection = 0;
    this.cargando = true;
    this.Favorites$ = this.global.GetFavorites().pipe(
      map((res: any) => {
        this.cargando = false;
        if (res.length > 0){
          this.fav = 1;
        } else {
          this.fav = 0;
        }
        this.favorites = res;
        return res;
      }),
      catchError(res => {
        this.conection = 1;
        this.cargando = false;
        return res;
      })
    );
  }

  DeleteFavorite(locId: string){
    this.loading.presentLoading(this.elmininadoFavorito);
    this.DelFavorite$ = this.global.DelFavorite(locId).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.loading.dismissLoading();
          this.GetFavorites();
          return res;
        }
      })
    );
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('CARGANDO_FAV').subscribe((res: string) => {
      this.cargandoFavorito = res;
    });

    this.translate.get('ELIMINANDO_FAV').subscribe((res: string) => {
      this.elmininadoFavorito = res;
    });
  }

}
