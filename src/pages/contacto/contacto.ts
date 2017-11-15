import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import {  } from '@ionic-native';

/**
 * Generated class for the ContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
/*declare var cordova: any;*/
@IonicPage()
@Component({
  selector: 'page-contacto',
  templateUrl: 'contacto.html',
})
export class ContactoPage {


  mail = {para:'tourgratisrusia@gmail.com', asunto:'', mensaje:''};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	
  }

}
