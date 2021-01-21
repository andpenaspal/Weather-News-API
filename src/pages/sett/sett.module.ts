import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettPage } from './sett';

@NgModule({
  declarations: [
    SettPage,
  ],
  imports: [
    IonicPageModule.forChild(SettPage),
  ],
})
export class SettPageModule {}
