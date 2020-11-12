import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ParamsService } from '../services/params.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from "@ngx-translate/core";
import { MonitorService } from '../services/monitor.service';

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
  cargando: boolean = true;
  externalLoad: number = 0;
  selectedTab: number = 0;

  newAppo: string='';
  oldAppo: string='';

  cargandoMensajes: string;
  deleteAppo: string;
  cancelAppo: string;
  titleBooking: string;
  textPrecheck: string;
  textCompleted: string;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    public toast: ToastController,
    public datepipe: DatePipe,
    public loading: LoadingService,
    private translate: TranslateService,
    private monitorService: MonitorService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.Customer = this.global.Customer;
  }

  syncData(data){
    if (data != undefined){
      if (data.Tipo == 'CANCEL'){
        console.log(data.AppId);
        this.results.forEach(function (r, i, o){
          r.Values.forEach(function(element, index, object) {
            console.log(element);
            if (element.AppointmentId == data.AppId){
              console.log("eliminar");
              object.splice(index, 1);
            }
          });
          if (r.Values.length == 0){
            o.splice(i, 1);
          }
        });
      }
  
      if (data.Tipo == 'APPO'){
        let entro = 0;
        let newApp = {
          AppointmentId: data.AppId,
          Status: data.Status,
          Address: data.Address,
          NameBusiness: data.NameBusiness,
          PeopleQty: data.Guests,
          QRCode: data.QRCode,
          UnRead: data.UnRead,
          Ready: data.Ready,
          CustomerId: data.CustomerId,
          DateAppo: data.DateFull,
          Disability: data.Disability,
          Door: data.Door,
          Name: data.Name,
          OnBehalf: data.OnBehalf,
          Phone: data.Phone
        }
        this.results.forEach(function (r, i, o){
          if (r.FullDate == data.DateFull.substring(0,10)){
            r.Values.push(newApp);
            entro = 1;
          }
        });
        if (entro == 0) {
          let res: any[]=[];
          res.push(newApp);
          this.results.push({
            DateAppo: this.datepipe.transform(data.DateFull.substring(0,10), 'MMM d, y'),
            FullDate: this.datepipe.transform(data.DateFull.substring(0,10), 'y-M-dd'),
            Values: res
          });
        }
        this.results.sort((a, b) => (a.FullDate < b.FullDate ? -1 : 1));
      }
      if (data.Tipo == 'MESS'){
        this.results.forEach(function (r, i, o){
          r.Values.forEach(function(element, index, object) {
            if (element.AppointmentId == data.AppId){
              element.UnRead='U';
            }
          });
        });
      }
    }
  }

  ionViewWillEnter(){
    this.cargando = true;
    this.Customer = this.global.Customer;
    this.externalLoad = 1;
    this.loadAppointments(0);
    this.externalLoad = 0;
    this.translateTerms();

    // this.ws.connect();
    this.result$ = this.monitorService.syncMessage.pipe(
      map((message: any) => {
        console.log(message);
        this.syncData(message);
      })
    );
  }

  async onCancel(appo: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.titleBooking,
      message: this.deleteAppo,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.loading.presentLoading(this.cancelAppo);
            this.CancelAppo$ = this.global.CancelAppointment(appo.AppointmentId, appo.DateAppo).pipe(
              map(async (res: any) => {
                if (res.Code == 200){
                  this.loading.dismissLoading();
                  this.externalLoad = 1;
                  this.loadAppointments(0);
                  this.externalLoad = 0;
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
        }
      ]
    });

    await alert.present();
  }

  loadAppointments(tab){
    this.selectedTab = tab;
    if (this.externalLoad == 0){
      this.cargando = true;
      if (tab == 0 && this.newAppo == 'primary') {return;}
      if (tab == 1 && this.oldAppo == 'primary') {return;}
    }

    if (tab == 0){
      this.newAppo = 'primary';
      this.oldAppo = 'secondary';
    } else {
      this.newAppo = 'secondary';
      this.oldAppo = 'primary';
    }
    this.connection = 0;
    this.results = [];
    this.Appos$ = this.global.GetAppointments(tab).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.cargando = false;
          if (res.Appointments.length == 0){
            this.display = 0;
          } else {
            this.display = 1;
          }
          var groups = new Set(res.Appointments.map(item => item.DateAppo.substring(0, 10)));
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
          return res.Appointments;
        }
      }),
      catchError(res =>{
        this.cargando = false;
        if (tab == 0){
          this.results = this.global.GetSessionCitas();
          if (this.results.length > 0){
            this.display = 1;
          }
        }
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
      OnBehalf: appo.OnBehalf,
      ServName: appo.ServName,
      ProvName: appo.ProvName
    };
    this.params.setParams(data);
  }

  onNotify(appo: any){
    this.CancelAppo$ = this.global.CommingAppointment(appo.AppointmentId).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          this.externalLoad = 1;
          this.loadAppointments(0);
          this.externalLoad = 0;
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
    this.translate.get('MSG_APPO').subscribe((res: string) => {
      this.deleteAppo = res;
    });
    this.translate.get('TITLE_BOOKING').subscribe((res: string) => {
      this.titleBooking = res;
    });
    this.translate.get('STATUS_PRECHECK').subscribe((res: string) => {
      this.textPrecheck = res;
    });
    this.translate.get('STATUS_COMPLETED').subscribe((res: string) => {
      this.textCompleted = res;
    });
  }
}
