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

  
  event = {title:'', startTime:null, endTime:null, description:null, guia: null, ubicacion:null, home:false}
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.event.title =  this.navParams.data.title;
  	this.event.startTime =  this.navParams.data.startTime;
  	this.event.endTime =  this.navParams.data.endTime;
  	this.event.description =  this.navParams.data.description;
  	this.event.guia =  this.navParams.data.guia;
  	this.event.ubicacion =  this.navParams.data.ubicacion;
    this.event.home =  this.navParams.data.home;
  	
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EvenDetailPage');
  }

}
