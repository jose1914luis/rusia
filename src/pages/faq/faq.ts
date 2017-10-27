import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  odoo = new Odoo(CONEXION);
  items = [];
  cargar = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
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

        self.odoo.execute_kw('tours.clientes.faq', 'search', params, function (err2, value2) {

            if (err2) {

            	return self.presentAlert('Falla!', 
            		'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
            }                        
            var inParams2 = [];
	        inParams2.push(value2); //ids
	        var params = [];
	        params.push(inParams2);
	        self.odoo.execute_kw('tours.clientes.faq', 'read', params, function (err3, value3) {
	            if (err2) { return console.log(err3); }
	            self.cargar = false;
	            for (var key in value3) {
      				(value3[key]).icon = 'arrow-dropdown-circle';
      				(value3[key]).visible = false;
            		self.items.push((value3[key]));	 	            		 
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
    //console.log('ionViewDidLoad FaqPage');
  }

  showResponse(item){
  	if(item.visible){
  		item.visible = false;
  		item.icon = 'arrow-dropup-circle';
  	}else{
  		item.visible = true;
  		item.icon = 'arrow-dropdown-circle';
  	}  	
  }

}
