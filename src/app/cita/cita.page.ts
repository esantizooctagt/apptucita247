import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ParamsService } from '../services/params.service';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
})
export class CitaPage implements OnInit {
  appo: any;
  elementType = NgxQrcodeElementTypes.CANVAS;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // this.translateTerms();
    this.appo = this.params.getParams();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  translateTerms() {
    this.translate.use(this.global.Language);
  }

}
