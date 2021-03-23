import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {GlobalService} from '../services/global.service';
import {LoadingService} from '../services/loading.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})
export class TelefonoPage implements OnInit {
  public form: FormGroup = this.fb.group({
    phoneNumber: [null, [Validators.required]],
  });

  get phoneNumber() {
    return this.form.get('phoneNumber') as FormControl;
  }

  number;
  enviandoSMS: string;
  ingreseSuNumero: string;
  seleccionar: string;
  cerrar: string;

  phCountry: string = '(___) ___-____';
  countryList: any = [
    {Country: 'PER', Name: 'Puerto Rico', Code: '+1', Flag: './assets/svg/pur.svg', PlaceHolder: '(___) ___-____'},
    {Country: 'GER', Name: 'Alemania', Code: '+49', Flag: './assets/svg/ger.svg', PlaceHolder: '___ ________'},
    {Country: 'GUA', Name: 'Guatemala', Code: '+502', Flag: './assets/svg/gua.svg', PlaceHolder: '____-____'},
    {Country: 'REP', Name: 'República Dominicana', Code: '+1', Flag: './assets/svg/rep.svg', PlaceHolder: '(___) ___-____'},
    {Country: 'ESP', Name: 'España', Code: '+34', Flag: './assets/svg/spa.svg', PlaceHolder: '___ ___ ___'},
    {Country: 'USA', Name: 'United States', Code: '+1', Flag: './assets/svg/usa.svg', PlaceHolder: '(___) ___-____'}
  ];
  //Flag: '🇵🇷', Flag: '🇩🇪', Flag: '🇬🇹', Flag: '🇩🇴', Flag: '🇪🇸', Flag: '🇺🇸', 
  countryCode: string = 'PER';
  code: string = '+1';

  constructor(
    private fb: FormBuilder,
    public global: GlobalService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private translate: TranslateService) { }
  
  ngOnInit() {
  }

  loadFlags(lstCountry){
    setTimeout(function(){ 
      let radios=document.getElementsByClassName('alert-radio-label');
      for (let index = 0; index <= radios.length-1; index++) {
          let element = radios[index];
          element.innerHTML='<img class="country-image" style="width: 25px;height: 20px;margin-right: 20px;padding-top: 5px;" src="'+lstCountry[index].Flag+'" /><span>'+lstCountry[index].Name+'</span>'+element.innerHTML;
        }
    }, 200);
  }

  onChange($event){
    this.phCountry = this.countryList.filter(x=>x.Country==$event.target.value)[0]['PlaceHolder'];
    this.code = this.countryList.filter(x=>x.Country==$event.target.value)[0]['Code'];
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  verifyPhoneNumber(){
    this.loading.presentLoading(this.enviandoSMS);
    let phoneNum: string = '';
    phoneNum = this.phoneNumber.value.replace( /\D+/g, '');
    phoneNum = this.code.replace( /\D+/g, '')+phoneNum;

    this.global.VerifyPhone(phoneNum).subscribe(content => {
      this.global.VerifcationCode = content['VerifcationCode'];
      this.global.Customer = content['Customer'];
      this.loading.dismissLoading();
      this.navCtrl.navigateRoot('/verificacion');
    });
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('ENVIANDO_SMS').subscribe((res: string) => {
      this.enviandoSMS = res;
    });
    this.translate.get('INGRESE_NUMERO').subscribe((res: string) => {
      this.ingreseSuNumero = res;
    });
    this.translate.get('CERRAR').subscribe((res: string) => {
      this.cerrar = res;
    });
    this.translate.get('SELECCIONAR').subscribe((res: string) => {
      this.seleccionar = res;
    });
  }

}
