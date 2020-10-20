import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  customer$: Observable<any>;
  name: any;
  email: any;
  birthDate: any;
  requerido:string;
  registrandoInformacion: string;
  errorIntenteNuevamente: string;
  registroDeUsuario: string;
  emailNull: string = "0";
  nameNull: string = "0";

  constructor(private global: GlobalService,
              public loadingCtrl: LoadingController,
              public toast: ToastController,
              private navCtrl: NavController,
              private translate: TranslateService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    // this.translateTerms();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  RegisterNewUser() {
    this.emailNull = "0";
    this.nameNull = "0";

    if (this.email == "" || this.email == undefined) { 
      this.emailNull = "1"; 
    }
    if (this.name == "" || this.name == undefined) { 
      this.nameNull = "1"; 
    }
    if (this.emailNull == "1" || this.nameNull == "1"){
      return;
    }
    this.presentLoading(this.registrandoInformacion);
    let birthdate = this.datePipe.transform(this.birthDate, 'dd-MM-yyyy');
    this.global.SetNewUser(this.global.PhoneNumber, this.name, this.email, birthdate).subscribe(content => {
      if (content['Code'] === 200) {
          this.global.SetSessionInfo(content['Customer']);
          this.loadingCtrl.dismiss();
          this.navCtrl.navigateRoot('/tabs/tab1');
          // this.global.VerifcationCode = content['VerifcationCode'];
          // this.global.Customer = content['Customer'];
          // this.loadingCtrl.dismiss();
          // this.navCtrl.navigateRoot('/verificacion');
      } else {
        this.errMessage();
      }
    });
  }

  async errMessage() {
    const errMessage = await this.toast.create({
      header: this.registroDeUsuario,
      message: this.errorIntenteNuevamente,
      position: 'middle',
      duration: 2000,
      // cssClass :clase,
    });
    errMessage.present();
  }

  async presentLoading(text: any) {
    const loading = await this.loadingCtrl.create({
      // cssClass: 'my-custom-class',
      message: text,
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  translateTerms() {
    this.translate.use(this.global.Language);

    this.translate.get('REQUERIDO').subscribe((res: string) => {
      this.requerido = res;
    });

    this.translate.get('REGISTRANDO_INFO').subscribe((res: string) => {
      this.registrandoInformacion = res;
    });

    this.translate.get('REGISTRO_DE_USUARIO').subscribe((res: string) => {
      this.registroDeUsuario = res;
    });

    this.translate.get('PASO_ALGO_MAL').subscribe((res: string) => {
      this.errorIntenteNuevamente = res;
    });
  }

}
