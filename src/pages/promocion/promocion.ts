import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PromoDetailPage } from '../../pages/promo-detail/promo-detail';

/**
 * Generated class for the PromocionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-promocion',
  templateUrl: 'promocion.html',
})
export class PromocionPage {


  odoo = new Odoo(CONEXION);
  items = [];
  cargar = true;
  //promocion = {city:'', numero:0, items:[]};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer) {
    var self = this;
  	this.odoo.connect(function (err) {
	    if (err) { 

	    	return self.presentAlert('Falla!', 
	    		'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
	    }	    
	    var inParams = [];
    	inParams.push([['id', '<>', '0']]);    	
    	var params = [];
    	params.push(inParams);

        self.odoo.execute_kw('tours.promociones', 'search', params, function (err2, value2) {

            if (err2) {

            	return self.presentAlert('Falla!', 
            		'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
            }                        
            var inParams2 = [];
	        inParams2.push(value2); //ids
	        var params = [];
	        params.push(inParams2);
	        self.odoo.execute_kw('tours.promociones', 'read', params, function (err3, value3) {
	            if (err2) { return console.log(err3); }
	            self.cargar = false;
	            for (var key in value3) {
	            	(value3[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ (value3[key]).promocion);
	            	(value3[key]).city = (value3[key]).city_id[1];
            		self.items.push(value3[key]);	 	            		 
            	}
	        });	
        });
	  });
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

  ionViewDidLoad() {

  }

  showImagen(item){
  	this.navCtrl.push(PromoDetailPage,{promo:item.name, image:item.promocion2});
  }

}
