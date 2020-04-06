import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private ap: AndroidPermissions) { }
  filePermission(){
    this.ap.hasPermission(this.ap.PERMISSION.WRITE_EXTERNAL_STORAGE).then(status => {
      if (!status.hasPermission) {
        this.ap.requestPermission(this.ap.PERMISSION.WRITE_EXTERNAL_STORAGE).then(status => {
          if(!status.hasPermission) {
            return false;
          }
        });
      } 
    });
    this.ap.hasPermission(this.ap.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
      if (!status.hasPermission) {
        this.ap.requestPermission(this.ap.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
          if(!status.hasPermission) {
            return false;
          }
        });
      } 
    });
    return true;
  }
}
