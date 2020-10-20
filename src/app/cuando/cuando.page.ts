import { Component, OnInit } from '@angular/core';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {GlobalService} from '../services/global.service';
import {TranslateService} from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cuando',
  templateUrl: './cuando.page.html',
  styleUrls: ['./cuando.page.scss'],
})
export class CuandoPage implements OnInit {
  dateWhen = '';
  fijarFecha: string;
  cerrar: string;
  minDate: string = '';
  maxDate: string = '';
  
  constructor(
      private datePicker: DatePicker,
      public global: GlobalService,
      private translate: TranslateService,
      private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    // this.translateTerms();
    let dateMin = new Date();
    let dateMax = new Date(new Date().setMonth(new Date().getMonth() + 6));
    let month:number = dateMin.getMonth()+1;
    
    this.minDate = dateMin.getFullYear() + '-' + month.toString().padStart(2, '0') + '-' + dateMin.getDate().toString().padStart(2, '0');
    this.maxDate = dateMax.getFullYear() + '-' + month.toString().padStart(2, '0') + '-' + dateMax.getDate().toString().padStart(2, '0');
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  setWhere(){
    this.global.When = this.datePipe.transform(this.dateWhen, 'dd-MM-yyyy');
  }
  removeDate(){
    this.global.When = '';
    this.dateWhen=null;
  }

  translateTerms() {
    this.translate.use(this.global.Language);

    this.translate.get('FIJAR_FECHA').subscribe((res: string) => {
      this.fijarFecha = res;
    });
    this.translate.get('CERRAR').subscribe((res: string) => {
      this.cerrar = res;
    });
  }

}
