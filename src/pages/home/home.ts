import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
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
        self.storage.get('tours.eventos').then((val) => {
         
          if(val == null){
                      
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
                                  ubicacion: (value2[key2]).company_id[1],
                                  estado: value_s[key_s].state
                                });            
                                break;
                              }
                            }                         
                          }                      
                        } 
                      }
                            
                      self.cargar = false;       
                      self.calendar.eventSource = events;
                      self.storage.set('tours.eventos', events);
                      
                  });

                });

              });
            });

          }else{

            var events = []; 
            for (var key in val) {            
              events.push({
                title: (val[key]).title,
                startTime: new Date((val[key]).startTime),
                endTime: new Date((val[key]).endTime),
                allDay: false,
                description: (val[key]).description,
                guia: (val[key]).guia,
                ubicacion: (val[key]).ubicacion,
                estado: (val[key]).estado
              });         
            }       
            self.cargar = false;       
            self.calendar.eventSource = events;
          }
        });
        
      }
    });
  }  

  addEvent(){

  	let modal = this.modalCtrl.create(EvenDetailPage, {startTime: new Date(), endTime:new Date(), home:true});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {

        let eventData = data;
        console.log(data.startTime);
        eventData.startTime = new Date(data.startTime);
        console.log(eventData.startTime);
        eventData.endTime = new Date(data.endTime);
        let events = this.calendar.eventSource;        
        events.push(eventData);
        this.calendar.eventSource = [];

        setTimeout(() => {
          this.calendar.eventSource = events;
          this.storage.set('tours.eventos', events);
        });
      }
    });    
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

    this.navCtrl.push(EvenDetailPage, {
      title: evt.title, 
      startTime: evt.startTime,
      endTime: evt.endTime, 
      description: evt.description,
      guia:evt.guia,
      ubicacion:evt.ubicacion,
      home:false,
      estado:evt.estado
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
