import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';
import { DownloadService } from '../../service/download/download.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  parms = null;
  categories = ['backgrounds', 'fashion', 'nature', 'science', 'education', 'feelings', 'health', 'people', 'religion', 'places', 'animals', 'industry', 'computer', 'food', 'sports', 'transportation', 'travel', 'buildings', 'business', 'music'];
  colors = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];
  languages = ["cs", "da", "de", "en", "es", "fr", "id", "it", "hu", "nl", "no", "pl", "pt", "ro", "sk", "fi", "sv", "tr", "vi", "th", "bg", "ru", "el", "ja", "ko", "zh"];
  constructor(
      private modalCtrl : ModalController,
      private download : DownloadService) { }
  ngOnInit() {
    
    this.download.currentFilter.subscribe((data : any) => {
      this.parms = data;
      //console.log(this.parms)
    })
  }
  closeFilter(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  applyFilter(){
    this.download.changeFilter(this.parms)
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  
}
