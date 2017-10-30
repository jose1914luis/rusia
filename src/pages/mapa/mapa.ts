import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  odoo = new Odoo(CONEXION);
  items = [];
  cargar = true;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {

    var self = this;
    self.items  = [];
    this.storage.get('tours.companies').then((val) => {

      if(val == null){
        
        self.odoo.connect(function (err) {
          if (err) {            
            return self.presentAlert('Falla!', 
              'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
          }      
          
          var inParams = [];
          inParams.push([['id', '<>', '0']]);   
          inParams.push(['id', 'mapa', 'name', 'punto_encuentro','url_map','phone']); //fields   
          var params = [];
          params.push(inParams);
          self.odoo.execute_kw('tours.companies', 'search_read', params, function (err2, value) {

            if (err2) {              
              return self.presentAlert('Falla!', 
                'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
            }                                  
            for (var key in value) {
              (value[key]).name = (value[key]).name[1];
              (value[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+(value[key]).mapa);     
              self.items.push((value[key]));
            }
            self.cargar = false;
            self.storage.set('tours.companies', self.items);
          });
        });
      }else{

        for (var key in val) {
          (val[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+(val[key]).mapa);     
          self.items.push((val[key]));
        }
        self.cargar = false;
      }      
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
