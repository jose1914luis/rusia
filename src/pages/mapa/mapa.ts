import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  odoo = new Odoo(CONEXION);
  items = [];
  cargar = true;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer) {

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

        self.odoo.execute_kw('tours.companies', 'search', params, function (err2, value2) {

            if (err2) {            	
            	return self.presentAlert('Falla!', 
            		'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
            }                        
            var inParams2 = [];
	        inParams2.push(value2); //ids
	        var params = [];
	        params.push(inParams2);
	        self.odoo.execute_kw('tours.companies', 'read', params, function (err3, value3) {
	            if (err2) { return console.log(err3); }
	            self.cargar = false;
	            for (var key in value3) {
	            	(value3[key]).name = (value3[key]).name[1];
            		(value3[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+(value3[key]).mapa);     
            		self.items.push((value3[key]));
            	}
	        });	
        });
    });

  }

  ionViewDidLoad() {

  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

}
