import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class LoadingService {
  isLoading = false;

  constructor(private loadingCtrl: LoadingController){}

  async presentLoading(text: any) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
        message: text,
        duration: 2000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismissLoading(){
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingCtrl.dismiss();
    }
    return null;
  }
  
}
