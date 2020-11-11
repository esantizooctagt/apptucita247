import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ParamsService } from '../services/params.service';
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from '../services/loading.service';
import { MonitorService } from '../services/monitor.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {
  Messages$: Observable<any[]>;
  SendMessage$: Observable<any>;
  result$: Observable<any>;
  txtMessage: string = '';
  appointmentId: string= '';
  appoObj: any;
  messages = [];

  mensajes: string;
  pasoAlgoMal: string;
  cargandoMensajes: string;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    public toast: ToastController,
    public datepipe: DatePipe,
    private translate: TranslateService,
    private monitorService: MonitorService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    // this.translateTerms();
    this.appoObj = this.params.getParams();
    this.appointmentId = this.appoObj.AppointmentId;
    this.loading.presentLoading(this.cargandoMensajes);
    this.Messages$ = this.global.GetMessages(this.appointmentId).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.messages = res.Messages;
          this.loading.dismissLoading();
          return res.Messages;
        }
      })
    );
  }

  ionViewWillEnter(){
    this.translateTerms();

    this.result$ = this.monitorService.syncMessage.pipe(
      map((message: any) => {
        console.log(message);
        this.syncData(message);
      })
    );
  }

  syncData(data){
    console.log("ingreso a ver");
    if (data != undefined){
      if (data.Tipo == 'MESS'){
        console.log("ingreso message");
        if (data.AppId == this.appointmentId){
          this.messages.push(data.Message);
        }
      }
    }
  }

  onMessage(){
    const datepipe: DatePipe = new DatePipe('en-US');
    var now = new Date();
    var messageData: string = '';

    let dataMess = {
      "U": this.txtMessage,
      "T": this.datepipe.transform(now, 'dd MMMM, h:mm a')
    }
    this.messages.push(dataMess);
    messageData = this.txtMessage;
    this.txtMessage = "";
    
    this.SendMessage$ = this.global.SendMessage(this.appointmentId, messageData).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          return res;
        } else {
          const msg = await this.toast.create({
            header: this.mensajes,
            message: this.pasoAlgoMal,
            position: 'bottom',
            duration: 2000,
          });
          this.messages.splice(-1);
          msg.present();
        }
      })
    )
  }

  translateTerms() {
    this.translate.use(this.global.Language);

    this.translate.get('CARGANDO_MSGS').subscribe((res: string) => {
      this.cargandoMensajes = res;
    });

    this.translate.get('MENSAJES').subscribe((res: string) => {
      this.mensajes = res;
    });
    this.translate.get('PASO_ALGO_MAL').subscribe((res: string) => {
      this.pasoAlgoMal = res;
    });
  }

}
