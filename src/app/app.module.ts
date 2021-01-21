import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettPage } from '../pages/sett/sett';
import { GetWeatherProvider } from '../providers/get-weather/get-weather';
import { GetNewsProvider } from '../providers/get-news/get-news';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetWeatherProvider,
    GetNewsProvider
  ]
})
export class AppModule {}
