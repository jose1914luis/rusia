import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import  * as Odoo from 'odoo-xmlrpc';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  items = [];
  cargar = true;
  mensaje = '';
  constructor(private base64ToGallery: Base64ToGallery, public navCtrl: NavController, private photoViewer: PhotoViewer, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {

    var self = this;
    self.items  = [];
     this.storage.get('CONEXION').then((val) => {
      if(val == null){
        self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
      }else{ 
        var odoo = new Odoo(val);
        this.storage.get('tours.companies').then((val_img) => {

          if(val_img == null){
            
            odoo.connect(function (err) {
              if (err) {    
                self.cargar = false;        
                self.presentAlert('Falla!', 'Imposible conectarse' );
              }      
              
              var inParams = [];
              inParams.push([['id', '<>', '0']]);   
              inParams.push(['id', 'mapa', 'name', 'punto_encuentro','url_map','phone']); //fields   
              var params = [];
              params.push(inParams);
              odoo.execute_kw('tours.companies', 'search_read', params, function (err2, value) {

                if (err2) {              
                  self.cargar = false;        
                  self.presentAlert('Falla!', 'Imposible conectarse' );
                }                                  
                for (var key in value) {
                  (value[key]).name = (value[key]).name[1];
                  (value[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, '+(value[key]).mapa);
                  self.items.push((value[key]));
                }
                self.cargar = false;
                self.storage.set('tours.companies', self.items);
              });
            });
          }else{

            for (var key in val_img) {

              (val_img[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, '+(val_img[key]).mapa);
              self.items.push((val_img[key]));
              
            }
            self.cargar = false;
          }      
        });  
      }
    });	
  }

  zoomImage(imageData) {

      var self = this;
      this.base64ToGallery.base64ToGallery(imageData, { prefix: '_img' }).then(
        res => {
          self.photoViewer.show(res);
        },
        err => {
          self.presentAlert('Falla','Error al cargar la imagen.');
        }
      );
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
