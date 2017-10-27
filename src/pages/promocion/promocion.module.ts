import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromocionPage } from './promocion';

@NgModule({
  declarations: [
    PromocionPage,
  ],
  imports: [
    IonicPageModule.forChild(PromocionPage),
  ],
})
export class PromocionPageModule {}
