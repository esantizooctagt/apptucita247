import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ParamsService } from '../services/params.service';
import { GlobalService } from '../services/global.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
// import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-comercio-localidad',
  templateUrl: './comercio-localidad.page.html',
  styleUrls: ['./comercio-localidad.page.scss'],
})

export class ComercioLocalidadPage implements OnInit {
  location: any;
  businessId: string = '';
  locationId: string = '';
  providerId: string = '';
  serviceId: string = '';
  doorSel: string = '';
  onbehalf: string = '';
  disability: string = '';
  display: string = '';
  minDate: string = '';
  maxDate: string = '';
  noResult: number = 0;

  services: any[]= [];
  providers: any[] = [];
  hideDoor: number = 1;
  hideProvider: number = 1;
  hideService: number = 1;
  provName: string = '';
  servName: string = '';
  doors = [];
  hoursData = [];
  dateAppo;

  hourAppo: string = '';
  Provider$: Observable<any[]>;
  Services$: Observable<any[]>;
  Favorite$: Observable<any>;
  Availabity$: Observable<any>;
  NewAppointment$: Observable<any>;
  provider: any;
  fav: number = 0;
  public guests: number = 1;

  agregaFav: string;
  quitaFav: string;
  cargando: string;
  guardandoCita: string;
  seleccione: string;
  seleccionar: string;
  cerrar: string;
  City: string;
  LocName: string;

  // liveData$ = this.messageService.messages$.pipe(
  //   map((res: any) => {
  //     console.log(res);
  //   }),
  //   catchError(error => { throw error }),
  //   tap({
  //     error: error => console.log('[Live Table component] Error:', error),
  //     complete: () => console.log('[Live Table component] Connection Closed')
  //   })
  // );

  constructor(
    private loadingCtrl: LoadingController,
    private params: ParamsService,
    private router: Router,
    public datepipe: DatePipe,
    public global: GlobalService,
    private loading: LoadingService,
    public toastController: ToastController,
    private translate: TranslateService
    // private messageService: MessageService
  ) {}

  async ngOnInit() {
    // this.translateTerms();
    this.location = this.params.getParams();
  }

  ionViewWillEnter(){
    // this.messageService.connect();

    let dateMin = new Date();
    let dateMax = new Date(new Date().setMonth(new Date().getMonth() + 6));
    let month:number = dateMin.getMonth()+1;
    this.display = this.global.Language;
    
    this.minDate = dateMin.getFullYear() + '-' + month.toString().padStart(2, '0') + '-' + dateMin.getDate().toString().padStart(2, '0');
    this.maxDate = dateMax.getFullYear() + '-' + month.toString().padStart(2, '0') + '-' + dateMax.getDate().toString().padStart(2, '0');
    this.loading.presentLoading(this.cargando);
    if (this.global.When == ''){
      this.dateAppo = this.minDate;
    } else {
      this.dateAppo = this.global.When;
    }
    
    this.businessId = this.location.BusinessId;
    this.locationId = this.location.Location.LocationId;
    this.doors = this.location.Location.Door.split(',');
    this.LocName = this.location.Location.Name;
    this.City = (this.global.Language.toUpperCase() == "EN" ? this.location.Location.City_ENG : this.location.Location.City_ESP);
    this.hideDoor = 0;
    if (this.doors.length > 0){
      this.doorSel = this.doors[0];
      if (this.doors.length == 1){
        this.hideDoor = 1;
      }
    }
    this.hideProvider = 0;
    this.provName = '';
    this.Provider$ = this.global.GetProviders(this.businessId, this.locationId).pipe(
      map((res: any) => {
        if (res.Code == 200){
          if (res.Providers.length == 1){
            this.provider = res.Providers[0].ProviderId;
            this.provName = res.Providers[0].Name;
            this.providerId = this.provider;
            // console.log(this.providerId);
            this.selectProvider(this.provider);
          } 
          this.providers = res.Providers;
          return res.Providers;
        }
      })
    );

    this.Favorite$ = this.global.GetFavorite(this.locationId).pipe(
      map((res: any)=>{
        if (res.Code == 200){
          this.fav = res.Favorite;
          return res.Favorite;
        }
      })
    );
    this.translateTerms();
  }

  onFavorite(){
    if (this.fav == 0){
      this.loading.presentLoading(this.agregaFav);
      this.Favorite$ = this.global.SetFavorite(this.businessId, this.locationId).pipe(
        map((res: any) => {
          if (res.Code === 200){
            this.fav = 1;
            this.loading.dismissLoading();
            return res;
          }
        })
      );
    }
    else {
      this.loading.presentLoading(this.quitaFav);
      this.Favorite$ = this.global.DelFavorite(this.locationId).pipe(
        map((res: any) => {
          if (res.Code === 200){
            this.fav = 0;
            this.loading.dismissLoading();
            return res;
          }
        })
      );
    }
  }

  getAvailability(){
    let newDate = this.datepipe.transform(this.dateAppo, 'MM-dd-yyyy');
    this.hourAppo = '';
    
    if (this.providerId == '' || this.serviceId == ''){ return; }
    this.loading.presentLoading(this.cargando);
    this.Availabity$ = this.global.GetAvailabity(this.businessId, this.locationId, this.provider, this.serviceId, newDate).pipe(
      map((res: any) => {
        if (res.Code == 200){
          this.loading.dismissLoading();
          this.hoursData = res.Hours;
          if (this.hoursData.length < 1){
            this.noResult = 1;
          } else {
            this.noResult = 0;
          }
          return res.Hours;
        }
      }),
      catchError(_ => {
        this.loading.dismissLoading();
        this.hoursData = [];
        return [];
      })
    );
  }

  changeDate(newDate: any){
    if (this.providerId == '' || this.serviceId == ''){ return; }
    this.hoursData = [];
    this.getAvailability();
  }

  saveOnHold(){
    this.loading.presentLoading(this.guardandoCita);
    let customer = this.global.Customer;
    let hr = "";
    if (this.hourAppo.substring(6) == "PM"){
      if (+this.hourAppo.substring(0,2) == 12){
        hr="12:00"
      }else{
        hr=(+this.hourAppo.substring(0,2)+12).toString()+":00"
      }
    }else{
      hr=this.hourAppo.substring(0,5)
    }
    let dataForm = {
      BusinessId: this.businessId,
      LocationId: this.locationId,
      ProviderId: this.providerId,
      ServiceId: this.serviceId,
      Name: (this.onbehalf != '' ? this.onbehalf : customer.Name),
      BusinessName: this.location.Name,
      BusinessAddr: this.location.Location.Address,
      OnBehalf: (this.onbehalf != '' ? 1 : 0),
      Phone: customer.Mobile,
      Door: this.doorSel,
      Guests: this.guests,
      Disability: this.disability,
      CustomerId: customer.CustomerId,
      AppoDate: this.datepipe.transform(this.dateAppo, 'MM-dd-yyyy'),
      AppoHour: hr
    };
    this.NewAppointment$ = this.global.PostOnHold(dataForm).pipe(
      map((res: any)=>{
        if (res.Code == 200){
          this.router.navigate(['/tabs/tab5']);
          this.loading.dismissLoading();
          return res;
        }
      })
    );
  }

  async saveAppointment(){
    this.loading.presentLoading(this.guardandoCita);
    let customer = this.global.Customer;
    let hr = "";
    if (this.hourAppo.substring(6) == "PM"){
      if (+this.hourAppo.substring(0,2) == 12){
        hr="12:00"
      }else{
        hr=(+this.hourAppo.substring(0,2)+12).toString()+":00"
      }
    }else{
      hr=this.hourAppo.substring(0,5)
    }
    let dataForm = {
      BusinessId: this.businessId,
      LocationId: this.locationId,
      BusinessName: this.location.Name,
      ProviderId: this.providerId,
      ServiceId: this.serviceId,
      Name: (this.onbehalf != '' ? this.onbehalf : customer.Name),
      OnBehalf: (this.onbehalf != '' ? 1 : 0),
      Phone: customer.Mobile,
      Door: this.doorSel,
      Guests: this.guests,
      Disability: this.disability,
      CustomerId: customer.CustomerId,
      AppoDate: this.datepipe.transform(this.dateAppo, 'MM-dd-yyyy'),
      AppoHour: hr,
      Language: this.global.Language.toLowerCase()
    };

    const toast = await this.toastController.create({
      message: 'Oops, an error ocur try again',
      duration: 2000
    });
    this.NewAppointment$ = this.global.PostAppointment(dataForm).pipe(
      map((res: any)=>{
        if (res.Code == 200){
          // console.log("send mess page");
          // this.messageService.sendMsg({"action":"sendMessage", "msg": JSON.stringify(res.Appointment)});
          // this.messageService.sendMessage({"action":"sendMessage", "msg": JSON.stringify(res.Appointment)});
          // setTimeout(() =>{
          this.router.navigate(['/tabs/tab2']);
            // this.messageService.close();
          // },1000);
          return res;
        }
        this.loading.dismissLoading();
      }),
      catchError(_ =>{
        return toast.present();
      })
    );
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('CARGANDO_INFO').subscribe((res: string) => {
      this.cargando = res;
    });
    this.translate.get('AGREGA_FAV').subscribe((res: string) => {
      this.agregaFav = res;
    });
    this.translate.get('QUITA_FAV').subscribe((res: string) => {
      this.quitaFav = res;
    });
    this.translate.get('GUARDANDO_CITA').subscribe((res: string) => {
      this.guardandoCita = res;
    });
    this.translate.get('CERRAR').subscribe((res: string) => {
      this.cerrar = res;
    });
    this.translate.get('SELECCIONAR').subscribe((res: string) => {
      this.seleccionar = res;
    });
    this.translate.get('SELECCIONE').subscribe((res: string) => {
      this.seleccione = res;
    });
  }

  selectProvider(event){
    this.providerId = event;
    this.serviceId = '';
    this.hoursData = [];
    this.hideService = 0;
    this.servName = '';
    this.Services$ = this.global.GetServices(this.businessId, this.providerId).pipe(
      map((res: any) => {
        if (res.Code == 200){
          if (res.Services.length == 1){
            if (this.provider.length == 1){
              this.hideProvider = 1;
            }
            this.hideService = 1;
            this.serviceId = res.Services[0].ServiceId; 
            this.servName = res.Services[0].Name;
            this.selectService(this.serviceId);
          }
          this.services = res.Services;
          return res.Services;
        }
      })
    );
  }

  selectService(event){
    this.serviceId = event;
    this.getAvailability();
  }

}
