import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../services/global.service';
import {IonInput, LoadingController, NavController, ToastController} from '@ionic/angular';
import {TranslateService} from "@ngx-translate/core";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
  @ViewChild('a', { static: true }) a0: IonInput;
  @ViewChild('b', { static: true }) b0: IonInput;
  @ViewChild('c', { static: true }) c0: IonInput;
  @ViewChild('d', { static: true }) d0: IonInput;
  @ViewChild('e', { static: true }) e0: IonInput;
  @ViewChild('f', { static: true }) f0: IonInput;

  code: any;
  path: string ='_';
  email: string='_';
  reenviadoSMS: string;
  codigoVerificacion: string;
  codigoIncorrecto: string;
  codigoVacio: string;
  ingreseCodigo: string;
  reenviadoEmail: string;
  newAccount: string = '';

  constructor(
    private fb: FormBuilder,
    public global: GlobalService,
    private loadingCtrl: LoadingController,
    public toast: ToastController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private translate: TranslateService) {}

  ngOnInit() {
    // this.translateTerms();
    this.path = this.route.snapshot.paramMap.get('path') == null ? "_" : "1";
    this.email = this.route.snapshot.paramMap.get('email') == null ? "_" : this.route.snapshot.paramMap.get('email');
    this.newAccount = this.route.snapshot.paramMap.get('new') == null ? "0" : "1";
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  ReVerifyPhoneNumber(){
    this.presentLoading(this.reenviadoSMS);
    this.global.VerifyPhone(this.global.PhoneNumber).subscribe(content => {
      this.global.VerifcationCode = content['VerifcationCode'];
      this.loadingCtrl.dismiss();
    });
  }

  ReVerifyEmail(){
    this.presentLoading(this.reenviadoEmail);

    this.global.VerifyEmail(this.email).subscribe(content => {
      this.global.VerifcationCode = content['VerificationCode'];
      this.loadingCtrl.dismiss();
    });
  }

  pasteUrl(e){
    this.b0.value = e.substring(1,2);
    this.c0.value = e.substring(2,3);
    this.d0.value = e.substring(3,4);
    this.e0.value = e.substring(4,5);
    this.f0.value = e.substring(5,6);
  }

  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode === 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else if (event.keyCode >= 96 && event.keyCode <= 105) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = '';
    }
  }

  onKeyPress(event): boolean { 
    console.log(event);
    const charCode = (event.which) ? event.which : event.keyCode;
    let perc: string = event.key.toString();
    var count = (perc.match(/[.]/g) || []).length;
    if (count  == 1) {
      if (charCode == 46) return false;
    }
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async CodeValidate() {
    const codigo = (this.a0.value.toString() + this.b0.value.toString() + this.c0.value.toString() + this.d0.value.toString() + this.e0.value.toString() + this.f0.value.toString());
    if (codigo.length < 6) {return; }
    if (codigo !== ''){
       if (codigo === this.global.VerifcationCode) {
        if (this.global.Customer.CustomerId !== undefined){
          if (this.newAccount == "0"){
            if(this.path == "_"){
              this.navCtrl.navigateRoot('/verifemail');
            } else {
              this.navCtrl.navigateRoot('/tabs/tab1');
              this.global.SetSessionInfo(this.global.Customer);
            }
          } else {
            this.navCtrl.navigateRoot('/registro/'+this.email);
          }
        }else{
          if (this.newAccount == "0"){
            this.navCtrl.navigateRoot('/verifemail/1');
          } else {
            this.navCtrl.navigateRoot('/registro/'+this.email);
          }
        }
      } else {
        const toast = await this.toast.create({
          header: this.codigoVerificacion,
          message: this.codigoIncorrecto,
          position: 'middle',
          duration: 2000
          // cssClass :clase,
        });
        toast.present();
      }
    }else{
      const toast = await this.toast.create({
        header: this.codigoVacio,
        message: this.ingreseCodigo,
        position: 'middle',
        duration: 2000,
        // cssClass :clase,
      });
      toast.present();
    }
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
    this.translate.get('REENVIANDO_SMS').subscribe((res: string) => {
      this.reenviadoSMS = res;
    });
    this.translate.get('CODIGO_DE_VERIFICACION').subscribe((res: string) => {
      this.codigoVerificacion = res;
    });
    this.translate.get('CODIGO_INCORRECTO').subscribe((res: string) => {
      this.codigoIncorrecto = res;
    });
    this.translate.get('CODIGO_VACIO').subscribe((res: string) => {
      this.codigoVacio = res;
    });
    this.translate.get('INGRESE_CODIGO_VERIFICACION').subscribe((res: string) => {
      this.ingreseCodigo = res;
    });
    this.translate.get('REENVIAR_EMAIL').subscribe((res: string) => {
      this.reenviadoEmail = res;
    }); 
  }
}
