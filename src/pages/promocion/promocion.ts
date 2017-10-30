import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PromoDetailPage } from '../../pages/promo-detail/promo-detail';
import { Storage } from '@ionic/storage';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {
    var self = this;
    self.items  = [];
    this.storage.get('tours.promociones').then((val) => {
      if(val == null){
      	this.odoo.connect(function (err) {
    	    if (err) { 

    	    	return self.presentAlert('Falla!', 
    	    		'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
    	    }	    
    	    var inParams = [];
        	inParams.push([['id', '<>', '0']]);    	
          inParams.push(['id', 'promocion', 'city_id','name']); //fields
        	var params = [];
        	params.push(inParams);

            self.odoo.execute_kw('tours.promociones', 'search_read', params, function (err2, value) {

                if (err2) {

                	return self.presentAlert('Falla!', 
                		'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
                }                        
                for (var key in value) {
                  (value[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ (value[key]).promocion);
                  (value[key]).city = (value[key]).city_id[1];
                  self.items.push(value[key]);                      
                }
                self.cargar = false;                  
                self.storage.set('tours.promociones', value);	
            });
    	  });
      }else{

        for (var key in val) {
          (val[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ (val[key]).promocion);
          self.items.push((val[key]));
        }
        self.cargar = false;
      }      
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
