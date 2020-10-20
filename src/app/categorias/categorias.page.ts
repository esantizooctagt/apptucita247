import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../services/global.service';
import {ParamsService} from '../services/params.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  categos: any[]=[];
  constructor(public global: GlobalService,
              private params: ParamsService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.global.Categories.forEach(val => this.categos.push(Object.assign({}, val)));
    this.categos = this.categos.sort((a, b) => (a.Name>b.Name)?1:-1);
    // this.translateTerms();
  }
  
  ionViewWillEnter(){
    this.translateTerms();
  }

  onCategory(CategoryId: string, CategoryName: string){
    const params = [CategoryId, CategoryName];
    this.params.setParams(params);
  }

  translateTerms() {
    this.translate.use(this.global.Language);
  }
}
