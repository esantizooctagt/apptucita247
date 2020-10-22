import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
  newAccount: string = '';
  createAccount: boolean = false;

  email: string;

  constructor(
    public global: GlobalService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // this.translateTerms();
    this.newAccount = this.route.snapshot.paramMap.get('new') == null ? "0" : "1";
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  SendCode(){
    this.invalidEmail = "";
    if (this.email == '') {return;}
    if (this.createAccount){ this.newAccount = '1';}
    if (this.email != this.global.Customer.Email && this.newAccount == '0') { this.invalidEmail = "1"; return;}
    this.loading.presentLoading(this.enviarCodigo);
    this.global.VerifyEmail(this.email).subscribe(content => {
      this.global.VerifcationCode = content['VerificationCode'];
      this.loading.dismissLoading();
      if (this.newAccount == '0'){
        this.navCtrl.navigateRoot('/verificacion/1/'+this.email);
      } else {
        this.navCtrl.navigateRoot('/verificacion/1/'+this.email+'/1');
      }
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
