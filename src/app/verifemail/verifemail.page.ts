import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-verifemail',
  templateUrl: './verifemail.page.html',
  styleUrls: ['./verifemail.page.scss'],
})
export class VerifemailPage implements OnInit {

  paso3: string = '';
  paso3Info: string = '';
  enviarCodigo: string = '';
  enviandoSMS: string = '';
  invalidEmail: string = '';
  invalidEmailTxt: string = '';
  enviarCodigoEmail: string = '';

  email: string;

  constructor(
    public global: GlobalService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // this.translateTerms();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  SendCode(){
    this.invalidEmail = "";
    if (this.email == '') {return;}
    if (this.email != this.global.Customer.Email) { this.invalidEmail = "1"; return;}
    this.loading.presentLoading(this.enviarCodigo);
    
    this.global.VerifyEmail(this.email).subscribe(content => {
      this.global.VerifcationCode = content['VerificationCode'];
      this.loading.dismissLoading();
      this.navCtrl.navigateRoot('/verificacion/1/'+this.email);
    });
  }

  translateTerms() {
    this.translate.use(this.global.Language);

    this.translate.get('PASO_3').subscribe((res: string) => {
      this.paso3 = res;
    });

    this.translate.get('PASO_3_INFO').subscribe((res: string) => {
      this.paso3Info = res;
    });

    this.translate.get('ENVIAR_CODIGO').subscribe((res: string) => {
      this.enviarCodigo = res;
    });

    this.translate.get('ENVIAR_CODIGO_EMAIL').subscribe((res: string) => {
      this.enviarCodigoEmail = res;
    });

    this.translate.get('CORREO_INVALIDO').subscribe((res: string) => {
      this.invalidEmailTxt = res;
    });
    
  }
}
