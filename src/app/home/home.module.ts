import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { HomePage } from './home.page';
import { FilterComponent } from '../filter/filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    MaterialModule
  ],
  declarations: [HomePage,FilterComponent],
  entryComponents: [ FilterComponent ]
})
export class HomePageModule {}
