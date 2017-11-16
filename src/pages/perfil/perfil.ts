import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import { DomSanitizer } from '@angular/platform-browser';
import  * as Odoo from 'odoo-xmlrpc';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  mensaje  ='';
  cargar =  false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private _DomSanitizer: DomSanitizer, private alertCtrl: AlertController, private camera: Camera) {

  	var self = this;
  	this.storage.get('res.users').then((val) => {      
      if(val == null){
      	self.navCtrl.setRoot(ListPage, {borrar: true});
      }else{
      	self.user.name = val.name;
      	self.user.login = val.login;
        if(val.image.length > 3){
          self.user.image = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ val.image); 
        }else{
          self.user.image = 'assets/imgs/icon_user.png?v=1';
        }
      	        
      }
  	});
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PerfilPage');
  }

  salir(){

  	this.navCtrl.setRoot(ListPage, {borrar: true, login:this.user.login});
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

  cambiarImagen(){

    var self = this;

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
      self.cargar = true;
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      self.user.image = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ imageData); 

      self.storage.get('CONEXION').then((val) => {

        if(val == null){
          self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
        }else{
          var odoo = new Odoo(val);
          odoo.connect(function (err) {

              if (err) { 
                self.cargar = false;
                return self.presentAlert('Falla!', 
                  'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
                
              }
              self.storage.get('res.users').then((val) => {

                if(val == null){
                  self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
                }else{

                  var inParams = [];
                  inParams.push([val.id]); //id to update
                  inParams.push({'image': imageData})
                  val.image = imageData;
                  var params = [];
                  params.push(inParams);
                  odoo.execute_kw('res.users', 'write', params, function (err, value) {

                      if (err) { 

                        return self.presentAlert('Falla!', 
                          'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
                      }
                      self.presentAlert('Alerta!','Se ha actualizado tu imagen de perfil.');
                      self.storage.set('res.users', val);
                      self.cargar = false;
                  });
                }
            });
              
          });                
        }
      });
    }, (err) => {

      self.presentAlert('Error!', JSON.stringify(err, Object.getOwnPropertyNames(err)));    
      self.cargar = false;  
    });

    
  }
}
