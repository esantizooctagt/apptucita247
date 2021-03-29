import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';

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

  constructor(public global: GlobalService,
              private loading: LoadingService,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit() {
      // this.translateTerms();
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
