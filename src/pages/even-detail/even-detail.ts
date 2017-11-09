import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  event = {title:'', startTime:null, endTime:null, description:null, guia: null, ubicacion:null, home:false}
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.event.title =  this.navParams.get('title');
  	this.event.startTime =  this.navParams.get('startTime').toISOString();
  	this.event.endTime =  this.navParams.get('endTime').toISOString();
  	this.event.description =  this.navParams.get('description');
  	this.event.guia =  this.navParams.get('guia');
  	this.event.ubicacion =  this.navParams.get('.ubicacion');
    this.event.home =  this.navParams.get('home');  	
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EvenDetailPage');
  }

}
