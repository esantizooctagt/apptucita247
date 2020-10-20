import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
// import { createTextMaskInputElement } from 'text-mask-core';
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

  constructor(
    private fb: FormBuilder,
    public global: GlobalService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private translate: TranslateService) { }
  
  ngOnInit() {
    // this.translateTerms();
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  verifyPhoneNumber(){
    this.loading.presentLoading(this.enviandoSMS);
    let phoneNumber;
    phoneNumber = '1'+this.phoneNumber.value.replace( /\D+/g, '');
    // phoneNumber = this.phoneNumber.value.replace( /\D+/g, '');
    this.global.VerifyPhone(phoneNumber).subscribe(content => {
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
  }

}
