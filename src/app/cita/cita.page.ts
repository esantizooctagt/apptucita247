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
  locText: string;
  provText: string;
  servText: string;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.appo = this.params.getParams();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('LOCATION').subscribe((res: string) => {
      this.locText = res;
    });
    this.translate.get('PROVIDER').subscribe((res: string) => {
      this.provText = res;
    });
    this.translate.get('SERVICE').subscribe((res: string) => {
      this.servText = res;
    });
  }

}
