import { Component,OnInit } from '@angular/core';
import { Platform,ToastController  } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { PermissionService } from '../../service/permission/permission.service';
import { DownloadService } from '../../service/download/download.service';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { FilterComponent } from '../filter/filter.component';
declare var cordova: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [FileTransfer, FileTransferObject,File,NgxIonicImageViewerModule],
})
export class HomePage implements OnInit {
  photo: SafeResourceUrl;
  storageDirectory: string = '';
  view = 'list';
  parms;
  constructor(
    private transfer: FileTransfer, 
    public platform: Platform,
    public toastCtrl: ToastController,
    public permission:PermissionService,
    public download:DownloadService,
    public modalCtrl: ModalController
  ) {
    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }
    if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.externalRootDirectory+'/Download/Pixabay/';
        //this.storageDirectory = 'file:///storage/emulated/0/Download/';
      }else {
        return false;
      }
    });
  }
  
  totalRecords = 0;
  totalHitsCount = 0;
  hits = null;
  
  loading = false
  public downloaded;
  ngOnInit(){
    this.download.currentFilter.subscribe((data : any) => {
      this.parms = data;
    })
    this.fetchImages();
    this.downloaded = this.download.getDownloaded();
  }
  fetchImages(){
    this.download.changeFilter(this.parms);
    this.loading = true;
    this.hits = null;
    
    this.download.fetchImages(this.parms).subscribe((data : any) => {
        this.totalHitsCount = data.totalHits;
        this.totalRecords = data.total;
        this.hits = data.hits;
        this.loading = false;
      });
  }
  nextPage(){
    this.parms.page = (this.parms.page+1)
    this.fetchImages();
    window.scrollTo(0,0)
  }
  prevPage(){
    this.parms.page = (this.parms.page-1)
    this.fetchImages();
    window.scrollTo(0,0)
  }
  async previewImage(url,name){
    const modal = await this.modalCtrl.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url,
        title : name,
        alt : 'loading ...'
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
    
    return await modal.present();
  }
  
  async downloadImage(url,name,qty){
    // if(this.checkDownloaded(name,qty)){
    //   this.showToast('File Downloaded');
    //   return ;
    // }

    if(this.permission.filePermission()){
      this.platform.ready().then(() => {
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(url, this.storageDirectory+name+'.jpg').then((entry) => {
          //console.log(entry)
          this.download.setDownloaded(name,qty);
          this.downloaded = this.download.getDownloaded();
          
          this.showToast('File Downloaded');
        }, (error : any) => {
          //console.log(error.body)
          this.showToast(error.body);
        });
      });
    }
  }
  checkDownloaded(name,qty){
    var returnData = true;
    var downloaded = JSON.parse(this.downloaded);
    downloaded.forEach(element => {
      if(element.name == name && element.qty == qty){
        returnData =  true;
      }else{
        returnData =  false;
      }
    });
    return returnData;
  }
  async showToast(msg){
    var toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      translucent : true,
      color : 'secondary'
    })
    await toast.present();
  }

  search(event){
    const searchTerm = event.srcElement.value;
    this.parms.q = searchTerm;
    this.fetchImages();
  }

  async openFilterModal(){
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
    });
    modal.onDidDismiss().then((d:any) => {
      this.fetchImages();
    });
    return await modal.present();
  }

}
