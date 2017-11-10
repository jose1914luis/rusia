import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { ListPage } from '../../pages/list/list';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  items = [];
  cargar = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private storage: Storage) {
    
    var self = this;
    self.items  = [];
    this.storage.get('CONEXION').then((val) => {
      if(val == null){
        self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
      }else{
        var odoo = new Odoo(val);
        this.storage.get('tours.clientes.faq').then((val) => {

          if(val == null){
          	odoo.connect(function (err) {
        	    if (err) { 

        	    	return self.presentAlert('Falla!', 
        	    		'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
        	    }	    
        	    var inParams = [];
            	inParams.push([['id', '<>', '0']]);    	
              inParams.push(['id', 'response', 'name']); //fields
            	var params = [];
            	params.push(inParams);

                odoo.execute_kw('tours.clientes.faq', 'search_read', params, function (err2, value) {

                  if (err2) {

                  	return self.presentAlert('Falla!', 
                  		'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
                  }                        
                  for (var key in value) {
                    (value[key]).icon = 'arrow-dropdown-circle';
                    (value[key]).visible = false;
                    self.items.push((value[key]));                      
                  }
                  self.cargar = false;                  
                  self.storage.set('tours.clientes.faq', value);
                });
        	  });
          }else{

            for (var key in val) {
              self.items.push((val[key]));
            }
            self.cargar = false;
          }      
        });   
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
