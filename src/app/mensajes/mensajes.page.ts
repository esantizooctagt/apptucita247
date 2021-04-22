import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { IonContent, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ParamsService } from '../services/params.service';
import { TranslateService } from '@ngx-translate/core';
import { MonitorService } from '../services/monitor.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  
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
    private navController: NavController,
    private monitorService: MonitorService,
    private ga: GoogleAnalytics
  ) { }

  ngOnInit() {
    this.appoObj = this.params.getParams();
    this.appointmentId = this.appoObj.AppointmentId;
    this.Messages$ = this.global.GetMessages(this.appointmentId).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.messages = res.Messages;
          return res.Messages;
        }
      }),
      delay(150),
      tap(() => {
        this.content.scrollToBottom(400);
      })
    );
  }

  ionViewWillEnter(){
    this.translateTerms();
    this.ga.trackView('Mensajes Page').then(res => {
      console.log("Registro Page");
    })
    .catch(e => console.log(e));

    this.result$ = this.monitorService.syncMessage.pipe(
      map((message: any) => {
        this.syncData(message);
      })
    );
  }

  syncData(data){
    if (data != undefined){
      if (data.Tipo == 'MESS'){
        if (data.AppId == this.appointmentId){
          this.messages.push(data.Message);
          this.content.scrollToBottom(400);
        }
      }
    }
  }

  gotoCita(){
    this.navController.navigateBack(['/tabs/tab2']);
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
    
    setTimeout(() => 
    {
      this.content.scrollToBottom(300);
    },
    500);
    
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

  onScrollEnd(event)
  {
    console.log('Scroll start');
  }

}
