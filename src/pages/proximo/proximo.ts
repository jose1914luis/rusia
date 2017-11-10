import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import  * as Odoo from 'odoo-xmlrpc';
import { EvenDetailPage } from '../even-detail/even-detail';
import { ListPage } from '../../pages/list/list';


@IonicPage()
@Component({
  selector: 'page-proximo',
  templateUrl: 'proximo.html',
})
export class ProximoPage {

  
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
  
  items = [];
  cargar = true;
  viewTitle = '';
  //mensaje = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {

    var self = this;
    self.calendar.eventSource = [];
    this.storage.get('CONEXION').then((val) => {
      if(val == null){
        self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
      }else{
        var odoo = new Odoo(val);
        this.storage.get('tours.guia').then((val) => {
         
          if(val == null){

            odoo.connect(function (err) {
              if (err) { 

                return self.presentAlert('Falla!', 
                  'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
              }      
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

                //traigo todos los tours
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
                    for (var key in value) {                  

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
                    self.cargar = false;       
                    self.calendar.eventSource = events;
                    self.storage.set('tours.guia', events);
                    //self.mensaje += JSON.stringify(events);
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
                ubicacion: (val[key]).ubicacion
              });         
            }       
            self.cargar = false;       
            self.calendar.eventSource = events;            
          }      
        });   
      }    
    });       
  } 

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

  ionViewDidLoad() {

  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

	onEventSelected(evt){

    this.navCtrl.push(EvenDetailPage, {
      title: evt.title, 
      startTime: evt.startTime,
      endTime: evt.endTime, 
      description: evt.description,
      guia:evt.guia,
      ubicacion:evt.ubicacion,
      home:false
    });
	}
}
