import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
//import { Calendar } from '@ionic-native/calendar';
//import { NgCalendarModule  } from 'ionic2-calendar';
import { EventModalPage } from '../../pages/event-modal/event-modal';
import * as moment from 'moment';
import { CONEXION } from '../../providers/constants/constants';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedDay = new Date();
  eventSource = [];
  calendar = {
    eventSource: [], 
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-RU',
    formatDayHeader: 'E',
    noEventsLabel: 'Sin Eventos',
    formatMonthTitle:'MMMM yyyy'
  };
  mensaje  ='';
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage) {

    // var prueba = [];
    // this.storage.get('items1').then((val) => {
    //   console.log(val);
    //   if(val == null){
    //     console.log('normal');
    //   }else{
    //     console.log('se carga');
    //   }
    // });
    // console.log(prueba);
    // console.log((prueba == []));

    //this.storage.set('items', null);
    //this.storage.set('tours.companies', null);
    //this.storage.set('tours.companies', null);
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
    //console.log(this.selectedDay);
  	let modal = this.modalCtrl.create(EventModalPage, {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
        console.log(data.startTime);
        eventData.startTime = new Date(data.startTime);
        console.log(eventData.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        console.log(eventData);
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });

    this.mensaje = JSON.stringify(this.eventSource);
  }

}
