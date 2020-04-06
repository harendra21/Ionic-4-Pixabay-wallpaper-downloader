import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient,) { }
  perms = {
    'q' : null,
    'lang' : null,
    'image_type' : 'all',
    'category' : null,
    'colors' : null,
    'order' : null,
    'per_page' : '10',
    'page' : 1
  };
  private filter = new BehaviorSubject(this.perms);
  currentFilter = this.filter.asObservable();
  api_key = '6430172-09d836b2d3bf7a1e65bb04b07';
  url = 'https://pixabay.com/api/?key='+this.api_key;

  changeFilter(data) {
    this.filter.next(data)
  }
  getDownloaded(){
    //localStorage.removeItem('downloaded')
    return localStorage.getItem('downloaded')
  }
  setDownloaded(name,qty){
    var file = [];
    if(localStorage.getItem('downloaded')){
      file = JSON.parse(localStorage.getItem('downloaded'))
    }
    file.push({name,qty})
    localStorage.setItem('downloaded',JSON.stringify(file));
  }
  fetchImages(filters){

    var i = 1;
    var query = '';
    for (var prop in filters){
      if(filters[prop] != null){
        query += '&'+prop+'='+filters[prop];
      }
      i++;
    }
    return this.http.get(this.url+query);
  }
}
