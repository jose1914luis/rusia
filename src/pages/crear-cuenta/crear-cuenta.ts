import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the CrearCuentaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-crear-cuenta',
  templateUrl: 'crear-cuenta.html',
})
export class CrearCuentaPage {

  mail = {para:'tourgratisrusia@gmail.com', nombre:'', email:'', hotel:'', tel:''};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  solicitar() {

  	if(this.mail.para.length < 3 || this.mail.email.length < 5 || this.mail.nombre.length < 2 || this.mail.hotel.length < 2 || this.mail.tel.length < 5 ){
  		this.presentAlert('Error!','Por favor ingresa correctamente todos los datos del formulario');
  		return;
  	}
    location.href="mailto:"+this.mail.para+"?subject=Solicitud de Cuenta&body=Solicitud de cuenta para Tour Gratis Rusia:%0D%0A%0D%0ANombre:"
     +this.mail.nombre+"%0D%0AEmail: "+this.mail.email+"%0D%0ATel: "+this.mail.tel+"%0D%0AHotel: "+this.mail.hotel;
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
