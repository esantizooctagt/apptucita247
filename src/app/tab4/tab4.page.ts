import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {
  Customer: any;
  Profile$: Observable<any>;
  imgAvatar$: Observable<any>;

  name: string = '';
  mobile: string = '';
  email: string = '';
  DOB: string = '';
  gender: string = '';
  preferences: string = '';
  disability: string = '';
  avatar: string = '';

  seleccione: string;

  fileName: string= '';
  fileString: any;
  displayForm: boolean=true;

  readonly imgPath = this.global.BucketPath;

  constructor(
    private fb: FormBuilder,
    public global: GlobalService,
    public toast: ToastController,
    private loading: LoadingService,
    private translate: TranslateService
  ) {}

  avatarForm = this.fb.group({
    Avatar: [null, Validators.required]
  });

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    this.name = this.Customer.Name;
    this.mobile = this.Customer.Mobile;
    this.email = this.Customer.Email;
    this.DOB = (this.Customer.DOB != '' ? this.Customer.DOB.substring(0,4)+'-'+this.Customer.DOB.substring(5,7)+'-'+this.Customer.DOB.substring(8,10) : '');
    this.gender = this.Customer.Gender;
    this.preferences = this.Customer.Preferences;
    this.disability = this.Customer.Disability;
    this.avatar = this.Customer.Avatar;
    this.translateTerms();
  }

  onSubmit(){
    if (this.DOB.length < 10 && this.DOB != 'None--' && this.DOB != '') {return;}
    let dobShort = (this.DOB != 'None--' ? '' : this.DOB.substring(0,4) + '-' + this.DOB.substring(5,7) + '-' + this.DOB.substring(8,10));  
    this.loading.presentLoading('Cargando Información...');
    this.Profile$ = this.global.UpdateProfile(this.name, this.gender, this.email, dobShort, this.preferences, this.disability).pipe(
      map(async (res: any) => {
        if (res.Code == 200){
          let dataForm = {
            CustomerId: this.Customer.CustomerId,
            DOB: this.DOB,
            Disability: this.disability,
            Email: this.email,
            Gender: this.gender,
            Mobile: this.mobile,
            Name: this.name,
            Preferences: this.preferences,
            Status: this.Customer.Status
          }
          this.global.SetSessionInfo(dataForm);
          this.loading.dismissLoading();
          const msg = await this.toast.create({
            header: "Profile",
            message: "Changes applied successfuly",
            position: 'bottom',
            duration: 2000,
          });
          msg.present();
          return res;
        }
      }),
      catchError(res => {
        return res;
      })
    );
  }

  dataURItoBlob(dataURI, dataType) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: dataType });    
    return blob;
  }
  
  loadCropImage($event){
    this.fileString = $event;
  }

  onClick(){
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      if (file === undefined) {return;}
      this.fileName = file['name'];
      if (file['type'] != "image/png" && file['type'] != "image/jpg" && file['type'] != "image/jpeg") { 
        // this.openDialog($localize`:@@shared.userpopup:`, $localize`:@@profile.fileextension:`, false, true, false);
        return; 
      }
      
      const reader: FileReader = new FileReader();
      reader.onload = (event: Event) => {
        let dimX = 75;
        let dimY = 75;
        if (file['size'] > 60000){
          // this.openDialog($localize`:@@shared.userpopup:`, $localize`:@@profile.filemaximun:`, false, true, false);
          return;
        }
        this.fileString = reader.result;
        this.onSubmitAvatar();
      }
      reader.readAsDataURL(fileUpload.files[0]);
    };
    fileUpload.click();
  }

  onSubmitAvatar() {
    const formData: FormData = new FormData();
    // var spinnerRef = this.spinnerService.start($localize`:@@profile.loadprof:`);
    formData.append('Image', this.fileString);
    let type: string ='';
    if (this.fileString.toString().indexOf('data:image/') >= 0){
      type = this.fileString.toString().substring(11,15);
    }
    if (type === 'jpeg' || type === 'jpg;'){
      type = '.jpg';
    }
    if (type === 'png;'){
      type = '.png';
    }

    this.imgAvatar$ = this.global.UploadAvatar(this.Customer.CustomerId, this.mobile, formData).pipe(
      tap(response =>  {
        let dataForm = {
          CustomerId: this.Customer.CustomerId,
          DOB: this.DOB,
          Disability: this.disability,
          Email: this.email,
          Gender: this.gender,
          Mobile: this.mobile,
          Name: this.name,
          Preferences: this.preferences,
          Status: this.Customer.Status,
          Avatar: this.imgPath+'/mobile/customer/'+this.Customer.CustomerId+type
        }
        // this.avatar = this.imgPath+'/mobile/customer/'+this.Customer.CustomerId+type;
        this.avatar = this.fileString;
        this.global.SetSessionInfo(dataForm);
          // this.spinnerService.stop(spinnerRef);
          // this.profileForm.patchValue({'Avatar': this.businessId+'/img/avatars/'+this.userId+type});
          // this.authService.setUserAvatar(this.businessId+'/img/avatars/'+this.userId+type);
          // this.avatarForm.reset({'Avatar':null});
          // this.fileString = null;
          // this.openDialog($localize`:@@shared.userpopup:`, $localize`:@@profile.uploadsuccess:`, true, false, false);
        }
      ),
      catchError(err => { 
        // this.spinnerService.stop(spinnerRef);
        // this.openDialog($localize`:@@shared.error:`, err.Message, false, true, false);
        return throwError(err || err.message);
      })
    );
  }

  async getMessage (header: string, message: string) {
    const msg = await this.toast.create({
      header: header,
      message: message,
      position: 'middle',
      duration: 2000,
    });
    msg.present();
  }

  translateTerms() {
    this.translate.use(this.global.Language);
    this.translate.get('SELECCIONE').subscribe((res: string) => {
      this.seleccione = res;
    });
  }

}
