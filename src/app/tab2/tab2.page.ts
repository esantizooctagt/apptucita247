import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AlertController, IonInfiniteScroll, NavController, ToastController } from '@ionic/angular';
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
  selectedTab: number = -1;
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
  textMess: string;
  textCancelar: string;
  textOK: string;
  textError: string;
  textCheckOut: string;
  currTimeZone: any;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    public toast: ToastController,
    public datepipe: DatePipe,
    public loading: LoadingService,
    private translate: TranslateService,
    private monitorService: MonitorService,
    private navController: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.Customer = this.global.Customer;
    this.currTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  syncData(data){
    if (data != undefined){
      console.log(data);
      if (data.Tipo == 'MESS'){
        if (this.global.Qeue.findIndex(x=>x.AppId==data.AppId && x.Tipo=='MESS' && x.DateFull==data.DateFull) < 0){
          this.global.Qeue.push(data);
        } else {
          return;
        }
      }
      if (data.Tipo == 'CANCEL'){
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
  
      if (data.Tipo == 'REVERSE' && this.selectedTab == 0){
        this.results.forEach(function (r, i, o){
          r.Values.forEach(function(element, index, object) {
            if (element.AppointmentId == data.AppId){
              element.Status = 1;
            }
          });
        });
      }

      if (data.Tipo == 'MOVE' && this.selectedTab == 0){
        if (data.To == 'PRECHECK'){
          this.results.forEach(function (r, i, o){
            r.Values.forEach(function(element, index, object) {
              if (element.AppointmentId == data.AppId){
                element.Status = 2;
              }
            });
          });
        }
        if (data.To == 'CHECKIN'){
          this.results.forEach(function (r, i, o){
            r.Values.forEach(function(element, index, object) {
              if (data.ManualCheckOut == 1){
                if (element.AppointmentId == data.AppId){
                  object.splice(index, 1);
                }
              } else {
                if (element.AppointmentId == data.AppId){
                  element.Status = 3;
                }
              }
            });
            if (r.Values.length == 0){
              o.splice(i, 1);
            }
          });
        }
        if (data.To == 'CHECKOUT'){
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
        if (data.To == 'EXPIRED'){
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
      }

      if (data.Tipo == 'MOVE' && this.selectedTab == 1){
        let exists = 0;
        let crea = 1;
        if (data.To == 'CHECKIN'){
          if (data.ManualCheckOut == 0){
            crea = 0;
          } else {
            this.results.forEach(function (r, i, o){
              r.Values.forEach(function(element, index, object) {
                if (element.AppointmentId == data.AppId){
                  exists = 1;
                }
              });
            });
          }
        }
        if (data.To == 'CHECKOUT'){
          this.results.forEach(function (r, i, o){
            r.Values.forEach(function(element, index, object) {
              if (element.AppointmentId == data.AppId){
                exists = 1;
              }
            });
          });
        }
        if (data.To == 'EXPIRED'){
          this.results.forEach(function (r, i, o){
            r.Values.forEach(function(element, index, object) {
              if (element.AppointmentId == data.AppId){
                exists = 1;
              }
            });
          });
        }
        if (exists == 0 && crea == 1 && (data.To == 'CHECKIN' || data.To == 'CHECKOUT' || data.To == 'EXPIRED')){
          let entro = 0;
          let newApp = {
            AppointmentId: data.AppId,
            Status: data.Status,
            Address: data.Address,
            NameBusiness: data.NameBusiness,
            Name: data.Name,
            Phone: data.Phone,
            DateAppo: data.DateFull,
            Door: data.Door,
            OnBehalf: data.OnBehalf,
            PeopleQty: data.Guests,
            QRCode: data.QrCode,
            Disability: data.Disability,
            UnRead: data.UnRead,
            Ready: data.Ready,
            ServName: data.Service,
            ManualCheckOut: data.ManualCheckOut,
            CustomerId: data.CustomerId,
            TimeZone: data.TimeZone,
            ProvName: data.Provider
          }
          this.results.forEach(function (r, i, o){
            if (r.FullDate == data.DateFull.substring(0,10)){
              let validate = r.Values.findIndex(x=>x.AppointmentId==data.AppId);
              if (validate < 0){
                r.Values.push(newApp);
                entro = 1;
              } else {
                entro = 1;
              }
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
          this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) < this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
          this.results.forEach(x =>
            x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) < this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
            );
          this.global.SetSessionCitas(this.results);
        }
      }

      if (data.Tipo == 'APPO'){
        let entro = 0;
        let newApp = {
          AppointmentId: data.AppId,
          Status: data.Status,
          Address: data.Address,
          NameBusiness: data.NameBusiness,
          Name: data.Name,
          Phone: data.Phone,
          DateAppo: data.DateFull,
          Door: data.Door,
          OnBehalf: data.OnBehalf,
          PeopleQty: data.Guests,
          QRCode: data.QrCode,
          Disability: data.Disability,
          UnRead: data.UnRead,
          Ready: data.Ready,
          ServName: data.Service,
          ManualCheckOut: data.ManualCheckOut,
          CustomerId: data.CustomerId,
          TimeZone: data.TimeZone,
          ProvName: data.Provider
        }
        this.results.forEach(function (r, i, o){
          if (r.FullDate == data.DateFull.substring(0,10)){
            let validate = r.Values.findIndex(x=>x.AppointmentId==data.AppId);
            if (validate < 0){
              r.Values.push(newApp);
              entro = 1;
            } else {
              entro = 1;
            }
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
        this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) < this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
        this.results.forEach(x =>
          x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) < this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
          );
        this.global.SetSessionCitas(this.results);
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
    this.lastItem = '';
    this.externalLoad = 1;
    this.loadAppointments(0);
    this.externalLoad = 0;
    this.translateTerms();

    // this.ws.connect();
    this.result$ = this.monitorService.syncMessage.pipe(
      map((message: any) => {
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
          text: this.textCancelar,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.textOK,
          handler: () => {
            this.cancelAppointment(appo.AppointmentId, appo.DateAppo);
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelAppointment(id, date){
    this.loading.presentLoading(this.cancelAppo);
    this.CancelAppo$ = await this.global.CancelAppointment(id, date).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          this.loading.dismissLoading();
          this.removeItem(id);
          return res;
        } else {
          this.loading.dismissLoading();
          const msg = await this.toast.create({
            header: this.textMess,
            message: this.textError,
            position: 'bottom',
            duration: 2000,
          });
          msg.present();
        }
      })
    );
  }

  removeItem(appId){
    this.results.forEach(function (r, i, o){
      r.Values.forEach(function(element, index, object) {
        if (element.AppointmentId == appId){
          object.splice(index, 1);
        }
      });
      if (r.Values.length == 0){
        o.splice(i, 1);
      }
    });
    if (this.results.length == 0){
      this.display = 0;
    }
  }

  loadAppointments(tab){
    if (tab == this.selectedTab && this.externalLoad == 0) { return; }
    if (this.selectedTab != tab) { 
      if (this.infiniteScroll != undefined){
        this.infiniteScroll.disabled = false;
      }
      this.lastItem = ''; 
    }
    this.selectedTab = tab;
    if (this.externalLoad == 0){
      this.cargando = true;
      if (tab == 0 && this.newAppo == 'secondary') {return;}
      if (tab == 1 && this.oldAppo == 'secondary') {return;}
    }

    if (tab == 0){
      this.newAppo = 'secondary';
      this.oldAppo = 'primary';
    } else {
      this.newAppo = 'primary';
      this.oldAppo = 'secondary';
    }
    this.connection = 0;
    this.results = [];
    let lastI = (this.lastItem == '' ? '_' : this.lastItem);
    let dateAppo = '_'
    // if (this.selectedTab == 1){
    //   lastI = (this.global.GetLastItem() == '' ? '_' : JSON.stringify(JSON.parse(this.global.GetLastItem())));
    //   var actualTime = new Date();
    //   actualTime.setDate(actualTime.getDate() -1);
    //   let todayDate = actualTime.getFullYear()+'-'+(actualTime.getMonth()+1).toString().padStart(2,'0')+'-'+actualTime.getDate().toString().padStart(2,'0');
    //   let prevDate = this.global.GetDatePreviousDate();

    //   if (prevDate == '' || prevDate == undefined){
    //     this.global.SetDatePreviousDate(todayDate);
    //   } else {
    //     this.results = this.global.GetSessionOldCitas();
    //     if (prevDate == todayDate && lastI == '_'){
    //       this.cargando = false;
    //       this.connection = 1;
    //       if (this.results.length > 0){
    //         this.display = 1;
    //       } else {
    //         this.display = 0;
    //       }
    //       return;
    //     }
    //     if (prevDate == todayDate && lastI != '_'){
    //       this.global.SetDatePreviousDate(todayDate);
    //     }
    //     if (prevDate < todayDate){
    //       lastI = '_'
    //       dateAppo = todayDate;
    //       this.global.SetDatePreviousDate(todayDate);
    //     }
    //   }
    // }
    this.Appos$ = this.global.GetAppointments(tab, dateAppo, lastI).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.lastItem = (res.LastItem != '' ? JSON.stringify(res.LastItem) : '');
          // if (res.Appointments.length < 5 && this.lastItem != ''){
          //   this.lastItem = '';
          // }

          // if (this.selectedTab == 1){
          //   if (res.LastItem != ''){
          //     this.global.SetLastItem(JSON.stringify(res.LastItem));
          //   } else {
          //     this.global.SetLastItem('');
          //   }
          // }  
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
            this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) < this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
            this.results.forEach(x =>
              x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) < this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
              );
            this.global.SetSessionCitas(this.results);
          } else {
            this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) > this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
            this.results.forEach(x =>
              x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) > this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
              );
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

  convertTZ(date, tzString) {
    let newDate = date.substring(0,10);
    let newHour = date.substring(11,16).replace('-',':');
    return new Date((typeof date === "string" ? new Date(newDate + ' ' + newHour) : date).toLocaleString("en-US", {timeZone: tzString}));
  }

  loadData(event){
    this.connection = 0;
    let lastI = (this.lastItem == '' ? '_' : this.lastItem);
    let dateAppo = '_'
    // if (this.selectedTab == 1){
    //   lastI = (this.global.GetLastItem() == '' ? '_' : JSON.stringify(JSON.parse(this.global.GetLastItem())));
    //   if (lastI == '_') {
    //     event.target.complete();
    //     event.target.disabled = true;
    //     this.connection = 1;
    //     return;
    //   }
    //   var actualTime = new Date();
    //   actualTime.setDate(actualTime.getDate() -1);
    //   let todayDate = actualTime.getFullYear()+'-'+(actualTime.getMonth()+1).toString().padStart(2,'0')+'-'+actualTime.getDate().toString().padStart(2,'0');
    //   let prevDate = this.global.GetDatePreviousDate();

    //   if (prevDate == '' || prevDate == undefined){
    //     this.global.SetDatePreviousDate(todayDate);
    //   } else {
    //     if (prevDate == todayDate && lastI == '_'){
    //       this.results = this.global.GetSessionOldCitas();
    //       this.cargando = false;
    //       this.connection = 1;
    //       if (this.results.length > 0){
    //         this.display = 1;
    //       } else {
    //         this.display = 0;
    //       }
    //       return;
    //     }
    //     if (prevDate == todayDate && lastI != '_'){
    //       this.global.SetDatePreviousDate(todayDate);
    //     }
    //     if (prevDate < todayDate){
    //       dateAppo = todayDate;
    //       this.global.SetDatePreviousDate(todayDate);
    //     }
    //   }
    // }
    if (lastI == '_') {
      event.target.complete();
      event.target.disabled = true;
      this.connection = 1;
      return;
    }
    this.Appos$ = this.global.GetAppointments(this.selectedTab, dateAppo, lastI).pipe(
      map((res: any) => {
        if (res.Code == 200){
          event.target.complete();
          this.lastItem = (res.LastItem != '' ? JSON.stringify(res.LastItem) : '');
          // if (this.selectedTab == 1){
          //   if (res.LastItem != ''){
          //     this.global.SetLastItem(JSON.stringify(res.LastItem));
          //   } else {
          //     this.global.SetLastItem('');
          //   }
          // }  
          if (this.lastItem == ''){
            event.target.disabled = true;
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
            this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) < this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
            this.results.forEach(x =>
              x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) < this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
              );
            this.global.SetSessionCitas(this.results);
          } else {
            this.results.sort((a, b) => (this.convertTZ(a.FullDate, this.currTimeZone) > this.convertTZ(b.FullDate, this.currTimeZone) ? -1 : 1));
            this.results.forEach(x =>
              x.Values.sort((a, b) => (this.convertTZ(a.DateAppo, this.currTimeZone) > this.convertTZ(b.DateAppo, this.currTimeZone) ? -1 : 1))
              );
            this.global.SetSessionCitasOld(this.results);
          }

          this.cargando = false;
          if (res.Appointments.length == 0){
            this.display = 0;
          } else {
            this.display = 1;
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

  sendParams(appo: any, link: string){
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
      ProvName: appo.ProvName,
      TimeZone: appo.TimeZone
    };
    this.params.setParams(data);
    if (link == 'mensajes'){
      appo.UnRead = '';
    }
    this.navController.navigateForward([link]);
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
    this.translate.get('MENSAJE').subscribe((res: string) => {
      this.textMess = res;
    });
    this.translate.get('OK').subscribe((res: string) => {
      this.textOK = res;
    });
    this.translate.get('CANCEL').subscribe((res: string) => {
      this.textCancelar = res;
    });
    this.translate.get('ERROR').subscribe((res: string) => {
      this.textError = res;
    });
    this.translate.get('CHECKOUTPROC').subscribe((res: string) => {
      this.textCheckOut = res;
    })
  }
}
