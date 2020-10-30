import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  paso3: string = '';
  paso3InfoAcc: string = '';
  paso3Mantener: string = '';
  paso3Nueva: string = '';
  continue: string = '';

  keepAccount: boolean = false;
  createAccount: boolean = false;
  constructor(
    public global: GlobalService,
    private navCtrl: NavController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.translateTerms();
  }

  selectCheckBox(data, ctrl){
    if (ctrl == 'keepAccount' && data == true){
      this.createAccount = false;
    }
    if (ctrl == 'createAccount' && data == true){
      this.keepAccount = false;
    }
  }

  nextStep(){
    if (!this.keepAccount && !this.createAccount) {return;}
    if (this.keepAccount) {
      this.navCtrl.navigateRoot('/verifemail/2');
    } else 
    {
      this.navCtrl.navigateRoot('/verifemail/3');
    }
  }

  translateTerms() {
    this.translate.use(this.global.Language);

    this.translate.get('PASO_3').subscribe((res: string) => {
      this.paso3 = res;
    });

    this.translate.get('PASO_3_INFO_ACC').subscribe((res: string) => {
      this.paso3InfoAcc = res;
    });

    this.translate.get('PASO_3_MANTENER').subscribe((res: string) => {
      this.paso3Mantener = res;
    });

    this.translate.get('PASO_3_NUEVA').subscribe((res: string) => {
      this.paso3Nueva = res;
    });

    this.translate.get('CONTINUE').subscribe((res: string) => {
      this.continue = res;
    });
  }

}
