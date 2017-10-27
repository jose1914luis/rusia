import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { EventModalPage } from '../pages/event-modal/event-modal';
import { ContactoPage } from '../pages/contacto/contacto';
import { FaqPage } from '../pages/faq/faq';
import { ProximoPage } from '../pages/proximo/proximo';
import { MapaPage } from '../pages/mapa/mapa';
import { PuntoPage } from '../pages/punto/punto';
import { PromocionPage } from '../pages/promocion/promocion';
import { PromoDetailPage } from '../pages/promo-detail/promo-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgCalendarModule  } from 'ionic2-calendar';
import { HttpModule } from '@angular/http';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    EventModalPage,
    ContactoPage,
    ProximoPage,
    FaqPage,
    MapaPage,
    PuntoPage,
    PromocionPage,
    PromoDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    EventModalPage,
    ContactoPage,
    ProximoPage,
    FaqPage,
    MapaPage,
    PuntoPage,
    PromocionPage,
    PromoDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
