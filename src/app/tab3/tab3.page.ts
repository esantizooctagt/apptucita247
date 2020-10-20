import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../services/global.service';
import {map, catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LoadingService} from '../services/loading.service';
import {TranslateService} from '@ngx-translate/core';
import { ParamsService } from '../services/params.service';

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

  cargandoFavorito: string;
  elmininadoFavorito: string;
  constructor(
    public global: GlobalService,
    public loading: LoadingService,
    private params: ParamsService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.lan = this.global.Language;
    this.translateTerms();
    this.GetFavorites();
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
    this.loading.presentLoading(this.cargandoFavorito);
    this.Favorites$ = this.global.GetFavorites().pipe(
      map((res: any) => {
        if (res.length > 0){
          this.fav = 1;
        } else {
          this.fav = 0;
        }
        this.loading.dismissLoading();
        return res;
      }),
      catchError(res => {
        this.conection = 1;
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
