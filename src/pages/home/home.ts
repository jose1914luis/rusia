import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
//import { Calendar } from '@ionic-native/calendar';
//import { NgCalendarModule  } from 'ionic2-calendar';
import { EventModalPage } from '../../pages/event-modal/event-modal';
import * as moment from 'moment';

import { CONEXION } from '../../providers/constants/constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedDay = new Date();
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-RU'
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController) {

    console.log(CONEXION);
  }

  onCurrentDateChanged(evt){

  }

  reloadSource(start, end){

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

  onViewTitleChanged(evt){

  }

  onTimeSelected(evt){

  	this.selectedDay = evt.selectedTime;
  }

  addEvent(){
  	let modal = this.modalCtrl.create(EventModalPage, {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

}
