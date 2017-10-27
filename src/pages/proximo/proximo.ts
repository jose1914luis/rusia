import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the ProximoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-proximo',
  templateUrl: 'proximo.html',
})
export class ProximoPage {

  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  //proxy = '/api';
  proxy = 'http://moscutourgratis.com:8069';
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {


  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProximoPage');
  }

	onEventSelected(evt){

		let start = moment(evt.startTime).format('LLLL');
		let end = moment(evt.endTime).format('LLLL');

		let alert = this.alertCtrl.create({
		  title: '' + evt.title,
		  subTitle: 'From: ' + start + '<br>To: ' + end,
		  buttons: ['OK']
		});
		alert.present();
	}
}
