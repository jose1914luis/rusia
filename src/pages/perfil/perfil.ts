import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

	user = {
		image: null,
		name: null,
		login: null
	}
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private _DomSanitizer: DomSanitizer) {

  	var self = this;
  	this.storage.get('res.users').then((val) => {      
      if(val == null){
      	self.navCtrl.setRoot(ListPage, {borrar: true});
      }else{
      	self.user.name = val.name;
      	self.user.login = val.login;
      	self.user.image = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ val.image); 
      }
  	});
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PerfilPage');
  }

  salir(){

  	this.navCtrl.setRoot(ListPage, {borrar: true, login:this.user.login});
  }
}
