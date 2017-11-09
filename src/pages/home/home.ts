import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
//import { Calendar } from '@ionic-native/calendar';
//import { NgCalendarModule  } from 'ionic2-calendar';
import { EventModalPage } from '../../pages/event-modal/event-modal';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import  * as Odoo from 'odoo-xmlrpc';
import { EvenDetailPage } from '../even-detail/even-detail';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedDay = new Date();
  eventSource = [];
  calendar = {
    eventSource:[],
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-RU',
    formatDayHeader: 'E',
    noEventsLabel: 'Sin Eventos',
    formatMonthTitle:'MMMM yyyy',
    allDayLabel: 'Todo el día',
    formatWeekTitle:'MMMM yyyy, Se $n'
  };
  mensaje  ='';
  cargar =  true;
  viewTitle = '';
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage) {

    var self = this;
    this.storage.get('CONEXION').then((val) => {
      
      if(val == null){
        self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
      }else{// se encontraron datos para la conexion 
        self.cargar = true;
        var odoo = new Odoo(val);
        odoo.connect(function (err) {
           if (err) { 
            self.cargar = false;
            return self.presentAlert('Falla!', 
              'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
          } 
          //
          var inParams = [];
          inParams.push([['id', '<>', '0']]);  
          inParams.push(['id', 'name', 'tour_id', 'state', 'num_person']); //fields 
          var params = [];
          params.push(inParams);
          odoo.execute_kw('tours.clientes.solicitudes', 'search_read', params, function (err_s, value_s) {

            if (err_s) {
              self.cargar = false;
              return self.presentAlert('Falla!', 
                'Error: '+ JSON.stringify(err_s, Object.getOwnPropertyNames(err_s)) );
            }

            //self.mensaje += JSON.stringify(value_s);
            //Traigo todos los eventos proximos
            var inParams = [];
            inParams.push([['id', '<>', '0']]);  
            inParams.push(['id', 'guia_id', 'tour_id','date_begin','date_end']); //fields 
            var params = [];
            params.push(inParams);
            odoo.execute_kw('tours.guia', 'search_read', params, function (err2, value) {

              if (err2) {
             
                return self.presentAlert('Falla!', 
                  'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
              } 

              /*self.mensaje += '----------------' + JSON.stringify(value);

              for(var key_s in value_s){                    

                for (var key in value) {                  
                  if(value_s[key_s].tour_id[0] == value[key].id ){//id:3076

                  }                      
                } 
              }*/

              //traigo toda la informacion de los tours
              var inParams = [];       
              inParams.push([['id', '<>', '0']]);
              inParams.push(['id','name','codigo','description', 'company_id']); //fields
              var params = [];
              params.push(inParams);                                
              odoo.execute_kw('tours', 'search_read', params, function (err3, value2) {
                  if (err3) {         
                    return self.presentAlert('Falla!', 
                      'Error: '+ JSON.stringify(err3, Object.getOwnPropertyNames(err3)) );
                  }
                  
                  var events = []; 

                  for(var key_s in value_s){                    

                    for (var key in value) {                  
                      if(value_s[key_s].tour_id[0] == value[key].id ){

                        var dateStart = new Date((value[key]).date_begin);
                        var dateEnd = new Date((value[key]).date_end);                    
                        var startTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes());
                        var endTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() , dateEnd.getHours(), dateEnd.getMinutes());
                        for (var key2 in value2){
                          if(value2[key2].id == (value[key]).tour_id[0]){
                            events.push({
                              title: (value2[key2]).name,
                              startTime: startTime,
                              endTime: endTime,
                              allDay: false,
                              description: (value2[key2]).description,
                              guia: (value[key]).guia_id[1],
                              ubicacion: (value2[key2]).company_id[1]
                            });            
                            break;
                          }
                        }                         
                      }                      
                    } 
                  }
                        
                  self.cargar = false;       
                  self.calendar.eventSource = events;
                  //self.storage.set('tours.guia', events);
                  self.mensaje += JSON.stringify(events);
              });

            });

          });
        });
      }
    });
  }

  onCurrentDateChanged(evt){

  }

  reloadSource(start, end){

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

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

  onEventSelected(evt){

    moment.locale('es');
    let start = moment(evt.startTime).format('LLLL');
    let end = moment(evt.endTime).format('LLLL');

    this.navCtrl.push(EvenDetailPage, {
      title: evt.title, 
      startTime: start,
      endTime: end, 
      description: evt.description,
      guia:evt.guia,
      ubicacion:evt.ubicacion,
      home:true
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

}
