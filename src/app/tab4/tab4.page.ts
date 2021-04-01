import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

const STORAGE_KEY = 'tucita247_profile';

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
  newImage: string = '';
  dispEnv: number = -1;
  dark: boolean;
  seleccione: string;

  fileName: string= '';
  fileString: any;
  displayForm: boolean=true;

  images: any = {
    name: '',
    path: '',
    filePath: ''
  };
  readonly imgPath = this.global.BucketPath;

  constructor(
    private fb: FormBuilder,
    public global: GlobalService,
    public toast: ToastController,
    private loading: LoadingService,
    private translate: TranslateService,
    private camera: Camera, private file: File, 
    private http: HttpClient, 
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private toastController: ToastController,
    private storage: Storage, 
    private plt: Platform, 
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private filePath: FilePath
  ) {}

  avatarForm = this.fb.group({
    Avatar: [null, Validators.required]
  });

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    this.dispEnv = this.global.AdmPhones.indexOf(this.global.Customer.Mobile);
    if (this.dispEnv > -1){
      this.global.GetPhoneInfo(this.global.Customer.Mobile).subscribe(content => {
        this.global.Customer = content['Customer'];
        this.Customer = this.global.Customer;

        this.name = this.Customer.Name;
        this.mobile = this.Customer.Mobile;
        this.email = this.Customer.Email;
        this.DOB = (this.Customer.DOB != '' ? this.Customer.DOB.substring(0,4)+'-'+this.Customer.DOB.substring(5,7)+'-'+this.Customer.DOB.substring(8,10) : '');
        this.gender = this.Customer.Gender;
        this.preferences = this.Customer.Preferences.toString();
        this.disability = this.Customer.Disability.toString();
      });
    } else {
      this.name = this.Customer.Name;
      this.mobile = this.Customer.Mobile;
      this.email = this.Customer.Email;
      this.DOB = (this.Customer.DOB != '' ? this.Customer.DOB.substring(0,4)+'-'+this.Customer.DOB.substring(5,7)+'-'+this.Customer.DOB.substring(8,10) : '');
      this.gender = this.Customer.Gender;
      this.preferences = this.Customer.Preferences.toString();
      this.disability = this.Customer.Disability.toString(); 
    }
    this.dark = this.global.GetMode();

    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
    this.translateTerms();
  }

  setMode(event){
    if (this.dark.toString() != this.global.GetMode().toString()){
      this.global.SetMode(this.dark);
      document.body.classList.toggle('dark');
    }
  }

  onSubmit(){
    let dobShort = (this.DOB != '' ? this.DOB.substring(0,4) + '-' + this.DOB.substring(5,7) + '-' + this.DOB.substring(8,10) : '');
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
          if (this.dispEnv == -1){
            this.global.SetSessionInfo(dataForm);
          }
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

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(data => {
      if (data) {
        this.images = JSON.parse(data);
        this.newImage = this.images.path;
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
 
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }

  createFileName() {
    // var newFileName = this.Customer.CustomerId + ".jpg";
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }
  
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  
  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      this.storage.remove(STORAGE_KEY);

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };
      this.images = newEntry;
      this.newImage = resPath;
      this.storage.set(STORAGE_KEY, JSON.stringify(this.images));
      // this.startUpload(newEntry);
      this.ref.detectChanges();
    });
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        ( < FileEntry > entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      });
  }
 
  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('Image', imgBlob, file.name);
      this.onSubmitAvatar(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async onSubmitAvatar(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();
    console.log(formData);
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
          Avatar: this.imgPath+'/mobile/customer/'+this.Customer.CustomerId+'.jpg'
        }
        // this.avatar = this.imgPath+'/mobile/customer/'+this.Customer.CustomerId+type;
        this.presentToast('File upload complete.');
        // this.avatar = this.fileString;
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
        this.presentToast('File upload failed.');
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
