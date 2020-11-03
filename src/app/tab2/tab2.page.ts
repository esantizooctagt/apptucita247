import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ParamsService } from '../services/params.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  Customer: any;
  Appos$: Observable<any[]>;
  result$: Observable<any>;
  CancelAppo$: Observable<any>;
  connection: number = 0;
  display: number = -1;
  results = [];

  cargandoMensajes: string;
  cancelAppo: string;
  
  constructor(
    public global: GlobalService,
    private params: ParamsService,
    public toast: ToastController,
    public datepipe: DatePipe,
    public loading: LoadingService,
    private translate: TranslateService,
    private ws: MessageService
  ) {}

  ngOnInit() {
    this.Customer = this.global.Customer;
    let custId = this.Customer.CustomerId;
    this.result$ = this.ws.connectWS('wss://1wn0vx0tva.execute-api.us-east-1.amazonaws.com/prod?customerId='+custId).pipe(
      map((data) => this.syncData(data))
    );
  }

  syncData(data){
    if (data.Tipo == 'CANCEL'){
      console.log("remove from list");
    }
    if (data.Tipo == 'APPO'){
      console.log("add new appo");
    }
    if (data.Tipo == 'MESS'){
      console.log("add new mess");
    }
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    this.loadAppointments();
    this.translateTerms();
  }

  loadAppointments(){
    this.loading.presentLoading(this.cargandoMensajes);
    this.connection = 0;
    this.results = this.global.GetSessionCitas();
    if (this.results.length > 0){
      this.display = 1;
    }
    this.Appos$ = this.global.GetAppointments().pipe(
      map((res: any) => {
        if (res.Code == 200){
          if (res.Appointments.length == 0){
            this.display = 0;
          } else {
            this.display = 1;
          }
          var groups = new Set(res.Appointments.map(item => item.DateAppo.substring(0, 10)));
          this.results = [];
          groups.forEach(g =>
            this.results.push({
              DateAppo: this.datepipe.transform(g, 'MMM d, y'),
              FullDate: this.datepipe.transform(g, 'y-M-dd'),
              Values: res.Appointments.filter(i => i.DateAppo.substring(0, 10) === g)
            }
          ));
          this.results.sort((a, b) => (a.FullDate < b.FullDate ? -1 : 1));
          this.global.SetSessionCitas(this.results);
          this.connection = 1;
          this.loading.dismissLoading();
          return res.Appointments;
        }
      }),
      catchError(res =>{
        // this.connection = 0;
        this.loading.dismissLoading();
        // this.results = this.global.GetSessionCitas();
        return this.global.GetSessionCitas();
      })
    );
  }

  sendParams(appo: any){
    let data = {
      AppointmentId: appo.AppointmentId,
      Name: appo.NameBusiness,
      Location: appo.Address,
      DateAppo: this.datepipe.transform(appo.DateAppo.substring(0,10), 'MMM d, y'),
      Time: appo.DateAppo.substring(11, 17).replace('-', ':') + (+appo.DateAppo.substring(11, 13) > 12 ? ' PM' : ' AM'),
      Disability: appo.Disability,
      Qty: appo.PeopleQty,
      QRCode: appo.QRCode,
      Door: appo.Door,
      UserName: appo.Name,
      OnBehalf: appo.OnBehalf
    };
    this.params.setParams(data);
  }

  onCancel(appo: any){
    console.log(appo.DateAppo);
    this.loading.presentLoading(this.cancelAppo);
    this.CancelAppo$ = this.global.CancelAppointment(appo.AppointmentId, appo.DateAppo).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          this.loading.dismissLoading();
          this.loadAppointments();
          return res;
        } else {
          this.loading.dismissLoading();
          const msg = await this.toast.create({
            header: 'Messages',
            message: 'Something goes wrong, try again',
            position: 'bottom',
            duration: 2000,
          });
          msg.present();
        }
      })
    );
  }

  onNotify(appo: any){
    this.CancelAppo$ = this.global.CommingAppointment(appo.AppointmentId).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          this.loadAppointments();
          return res;
        } else {
          const msg = await this.toast.create({
            header: 'Messages',
            message: 'Something goes wrong, try again',
            position: 'bottom',
            duration: 2000,
          });
          msg.present();
        }
      })
    );
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('CARGANDO_MSGS').subscribe((res: string) => {
      this.cargandoMensajes = res;
    });
    this.translate.get('CANCEL_APPO').subscribe((res: string) => {
      this.cancelAppo = res;
    });
  }
}
