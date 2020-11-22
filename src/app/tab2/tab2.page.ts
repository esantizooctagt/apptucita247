import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AlertController, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ParamsService } from '../services/params.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from "@ngx-translate/core";
import { MonitorService } from '../services/monitor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
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
  lastItem: string = '_';

  newAppo: string='';
  oldAppo: string='';

  cargandoMensajes: string;
  deleteAppo: string;
  cancelAppo: string;
  titleBooking: string;
  textPrecheck: string;
  textCompleted: string;
  textCancel: string;
  textExpired: string;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    public toast: ToastController,
    public datepipe: DatePipe,
    public loading: LoadingService,
    private router: Router,
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
            if (element.AppointmentId == data.AppId){
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
    if (this.selectedTab != tab) { 
      if (this.infiniteScroll != undefined){
        this.infiniteScroll.disabled = false;
      }
      this.lastItem = ''; 
    }
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
    let lastI = (this.lastItem == '' ? '_' : this.lastItem);
    let dateAppo = '_'
    if (this.selectedTab == 1){
      lastI = (this.global.GetLastItem() == '' ? '_' : this.global.GetLastItem());
      var actualTime = new Date();
      actualTime.setDate(actualTime.getDate() -1);
      let todayDate = actualTime.getFullYear()+'-'+(actualTime.getMonth()+1).toString().padStart(2,'0')+'-'+actualTime.getDate().toString().padStart(2,'0');
      let prevDate = this.global.GetDatePreviousDate();

      if (prevDate == '' || prevDate == undefined){
        this.global.SetDatePreviousDate(todayDate);
      } else {
        if (prevDate == todayDate && lastI == '_'){
          this.results = this.global.GetSessionOldCitas();
          this.cargando = false;
          this.connection = 1;
          if (this.results.length > 0){
            this.display = 1;
          } else {
            this.display = 0;
          }
          return;
        }
        if (prevDate == todayDate && lastI != '_'){
          this.global.SetDatePreviousDate(todayDate);
        }
        if (prevDate < todayDate){
          dateAppo = todayDate;
          this.global.SetDatePreviousDate(todayDate);
        }
      }
    }
    this.Appos$ = this.global.GetAppointments(tab, dateAppo, lastI).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.lastItem = (res.LastItem != '' ? JSON.stringify(res.LastItem) : '');
          if (this.selectedTab == 1){
            this.global.SetLastItem(JSON.stringify(res.LastItem));
          }  
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
          if (tab == 0){
            this.results.sort((a, b) => (a.FullDate < b.FullDate ? -1 : 1));
            this.global.SetSessionCitas(this.results);
          } else {
            this.results.sort((a, b) => (a.FullDate > b.FullDate ? -1 : 1));
            this.global.SetSessionCitasOld(this.results);
          }
          this.connection = 1;
          return res.Appointments;
        }
      }),
      catchError(res =>{
        this.lastItem = '';
        this.cargando = false;
        if (tab == 0){
          this.results = this.global.GetSessionCitas();
          if (this.results.length > 0){
            this.display = 1;
          }
        }
        if (tab == 1){
          this.results = this.global.GetSessionOldCitas();
          if (this.results.length > 0){
            this.display = 1;
          }
        }
        return this.global.GetSessionCitas();
      })
    );
  }

  loadData(event){
    this.connection = 0;
    let lastI = (this.lastItem == '' ? '_' : this.lastItem);
    let dateAppo = '_'
    if (this.selectedTab == 1){
      lastI = (this.global.GetLastItem() == '' ? '_' : this.global.GetLastItem());
      var actualTime = new Date();
      actualTime.setDate(actualTime.getDate() -1);
      let todayDate = actualTime.getFullYear()+'-'+(actualTime.getMonth()+1).toString().padStart(2,'0')+'-'+actualTime.getDate().toString().padStart(2,'0');
      let prevDate = this.global.GetDatePreviousDate();

      if (prevDate == '' || prevDate == undefined){
        this.global.SetDatePreviousDate(todayDate);
      } else {
        if (prevDate == todayDate && lastI == '_'){
          this.results = this.global.GetSessionOldCitas();
          this.cargando = false;
          this.connection = 1;
          if (this.results.length > 0){
            this.display = 1;
          } else {
            this.display = 0;
          }
          return;
        }
        if (prevDate == todayDate && lastI != '_'){
          this.global.SetDatePreviousDate(todayDate);
        }
        if (prevDate < todayDate){
          dateAppo = todayDate;
          this.global.SetDatePreviousDate(todayDate);
        }
      }
    }
    this.Appos$ = this.global.GetAppointments(this.selectedTab, dateAppo, lastI).pipe(
      map((res: any) => {
        if (res.Code == 200){
          event.target.complete();
          this.lastItem = (res.LastItem != '' ? JSON.stringify(res.LastItem) : '');
          if (this.selectedTab == 1){
            this.global.SetLastItem(JSON.stringify(res.LastItem));
          }  
          if (this.lastItem == ''){
            event.target.disabled = true;
          }
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
          if (this.selectedTab == 0){
            this.results.sort((a, b) => (a.FullDate < b.FullDate ? -1 : 1));
            this.global.SetSessionCitas(this.results);
          } else {
            this.results.sort((a, b) => (a.FullDate > b.FullDate ? -1 : 1));
            this.global.SetSessionCitasOld(this.results);
          }
          this.connection = 1;
          return res.Appointments;
        }
      }),
      catchError(res =>{
        this.lastItem = '';
        this.cargando = false;
        if (this.selectedTab == 0){
          this.results = this.global.GetSessionCitas();
          if (this.results.length > 0){
            this.display = 1;
          }
        }
        if (this.selectedTab == 1){
          this.results = this.global.GetSessionOldCitas();
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

  gotoCita(appo: any){
    if (this.selectedTab==0){return;}
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
    this.router.navigate(['/cita']);
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
    this.translate.get('STATUS_CANCEL').subscribe((res: string) => {
      this.textCancel = res;
    });
    this.translate.get('STATUS_EXPIRED').subscribe((res: string) => {
      this.textExpired = res;
    });
  }
}
