import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ParamsService } from '../services/params.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from "../services/loading.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  Customer: any;
  Appos$: Observable<any[]>;
  CancelAppo$: Observable<any>;
  NewAppointment$: Observable<any>;
  connection: number = 0;
  display: number = -1;
  results = [];
  conection = 0;
  yesStr: string;

  cargandoMensajes: string;

  constructor(
    public global: GlobalService,
    private params: ParamsService,
    private router: Router,
    public toast: ToastController,
    public datepipe: DatePipe,
    public loading: LoadingService,
    private translate: TranslateService,
    private ga: GoogleAnalytics
  ) { }

  ngOnInit() {
    this.Customer = this.global.Customer;
    this.display = -1;
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    let lang = this.global.Language;
    this.display = -1;
    this.yesStr = (lang == 'en' ? 'Yes' : 'Si'); 
    this.loadAppointments();
    this.translateTerms();
    this.ga.trackView('On hold Page').then(res => {
      console.log("Registro Page");
    })
    .catch(e => console.log(e));
  }

  loadAppointments(){
    this.conection = 0;
    this.loading.presentLoading(this.cargandoMensajes);
    this.Appos$ = this.global.GetReserve().pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.loading.dismissLoading();
          if (res.Appointments.length == 0){
            this.display = 0;
          } else {
            this.display = 1;
          }
          return res.Appointments;
        }
      }),
      catchError(res =>{
        this.conection = 1;
        this.loading.dismissLoading();
        return res;
      })
    );
  }

  onCancel(appo: any){
    this.CancelAppo$ = this.global.CancelReserve(appo.AppointmentId).pipe(
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
  }

  saveAppos(){
    let dataForm = {
      CustomerId: this.Customer.CustomerId
    }
    this.NewAppointment$ = this.global.PostAppos(dataForm).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          this.router.navigate(['/tabs/tab2']);
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

}
