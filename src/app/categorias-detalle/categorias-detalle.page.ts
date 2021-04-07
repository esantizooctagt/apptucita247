import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll } from '@ionic/angular';
import { ParamsService } from '../services/params.service';
import { GlobalService } from '../services/global.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categorias-detalle',
  templateUrl: './categorias-detalle.page.html',
  styleUrls: ['./categorias-detalle.page.scss'],
})
export class CategoriasDetallePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(public actionSheetController: ActionSheetController,
              public params: ParamsService,
              public global: GlobalService,
              public loading: LoadingService,
              private translate: TranslateService) { }

  Business: any[]=[];
  businessId = '_';

  categoryId = '_';
  categoryName = '';

  SubCateoriesArray: any;
  subcategoryId = '_';
  subcategoryTxt = '';

  lastItem = '_';
  cargando: string;
  especialidades: string;

  resultset = -1;

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.especialidades,
      // cssClass: 'my-custom-class',
      buttons: this.createSubCategoryButtons(),
    });
    await actionSheet.present();
  }

  ngOnInit() {
    this.resultset = -1;
    // this.translateTerms();
    this.categoryId = this.params.getParams()[0];
    // this.categoryName = this.params.getParams()[1];
    this.subcategoryId = (this.params.getParams()[2] != undefined ? this.params.getParams()[2] : '_');
    if (this.subcategoryId != '_'){
      this.subcategoryTxt = this.params.getParams()[1];
    }
    this.getSubCategories();
    this.getBusiness();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  getSubCategories() {
    this.global.GetSubCategories(this.categoryId)
      .subscribe((content: any) => {
        this.SubCateoriesArray = content;
        let valName = content.filter(x=>x.SubCategoryId.substring(0,3)=='CAT');
        if (valName != undefined){
          this.categoryName = valName[0]['Name'];
        }
      });
  }

  removeSubCategory(){
    this.subcategoryId = '_';
    this.lastItem = '_';
    this.Business = [];
    this.getBusiness();
  }

  getBusiness(){
    this.loading.presentLoading(this.cargando);
    this.resultset = (this.Business.length > 0 ? 1 : 0);
    this.global.GetBusiness(this.businessId, this.categoryId, this.subcategoryId, this.lastItem)
        .subscribe(content => {
          content['Business'].forEach(item => {
            let data = {
              Business_Id: item['Business_Id'],
              Categories: item['Categories'],
              Imagen: item['Imagen'],
              Location_No: item['Location_No'],
              LongDescription: item['LongDescription'],
              Name: item['Name'],
              ShortDescription: item['ShortDescription'],
              Status: item['Status']
            };
            this.resultset = 1;
            this.Business.push(data);
          });
          this.infiniteScroll.complete();
          if (content['LastItem'] == ''){
            this.lastItem = '_';
          }else{
            this.lastItem = content['LastItem'];
            this.infiniteScroll.disabled = false;
          }
          this.resultset = (this.Business.length > 0 ? 1 : 0);
          this.loading.dismissLoading();
        });
  }

  createSubCategoryButtons() {
    const buttons = [];
    for (const index in this.SubCateoriesArray) {
      const button = {
        text: this.SubCateoriesArray[index].Name,
        // icon: this.possibleButtons[index].icon,
        handler: () => {
          this.subcategoryId = this.SubCateoriesArray[index].SubCategoryId;
          this.subcategoryTxt = this.SubCateoriesArray[index].Name;
          this.lastItem = '_';
          this.Business = [];
          this.getBusiness();
          return true;
        }
      };
      buttons.push(button);
    }
    return buttons;
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('CARGANDO_INFO').subscribe((res: string) => {
      this.cargando = res;
    });
    this.translate.get('ESPECIALIDADES').subscribe((res: string) => {
      this.especialidades = res;
    });
  }

  trackById(index: number, item: any) {
    return item.Business_Id;
  }

  loadMore(event){
    if (this.lastItem == '_') {
      event.target.disabled = true;
    } else {
      this.getBusiness();
      if (this.lastItem != '_') {
        event.target.disabled = true;
      }
    }
  }

}
