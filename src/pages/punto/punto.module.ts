import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuntoPage } from './punto';

@NgModule({
  declarations: [
    PuntoPage,
  ],
  imports: [
    IonicPageModule.forChild(PuntoPage),
  ],
})
export class PuntoPageModule {}
