import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the EvenDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-even-detail',
  templateUrl: 'even-detail.html',
})
export class EvenDetailPage {

  mensaje = '';
  event = {title:'', startTime:null, endTime:null, allDay: false, description:null, guia: null, ubicacion:null, home:false}
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController) {
  	this.event.title =  this.navParams.get('title');
  	this.event.startTime =  this.navParams.get('startTime').toISOString();
  	this.event.endTime =  this.navParams.get('endTime').toISOString();
  	this.event.description =  this.navParams.get('description');
  	this.event.guia =  this.navParams.get('guia');
  	this.event.ubicacion =  this.navParams.get('ubicacion');
    this.event.home =  this.navParams.get('home');  	
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EvenDetailPage');
  }

  guardar(){
    this.viewCtrl.dismiss(this.event);
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'numper',
          placeholder: 'Numero de Personas',
          type: 'number'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continuar',
          handler: data => {
            /*if (User.isValid(data.username, data.password)) {
              // logged in!
            } else {
              // invalid login
              return false;
            }*/
          }
        }
      ]
    });
    alert.present();
  }

}
