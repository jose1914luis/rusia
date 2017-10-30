import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import * as moment from 'moment';
import 'moment/locale/es';
import { Storage } from '@ionic/storage';
import  * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';

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
  odoo = new Odoo(CONEXION);
  items = [];
  cargar = true;
  viewTitle = '';
  mensaje= '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {

    var self = this;
    this.odoo.connect(function (err) {
      if (err) { 

        return self.presentAlert('Falla!', 
          'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
      }      
      var inParams = [];
      inParams.push([['id', '<>', '0']]);  
      inParams.push(['id', 'guia_id', 'tour_id','date_begin','date_end']); //fields 
      var params = [];
      params.push(inParams);
      self.odoo.execute_kw('tours.guia', 'search_read', params, function (err2, value) {

        if (err2) {
       
          return self.presentAlert('Falla!', 
            'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
        } 
        var events = []; 

        var con = 49;
        for (var key in value) {
          

            var dateStart = new Date((value[key]).date_begin);
            var dateEnd = new Date((value[key]).date_end);
            
            var startTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes());
            var endTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() , dateEnd.getHours(), dateEnd.getMinutes());
            events.push({
                title: (value[key]).tour_id[1],
                startTime: startTime,
                endTime: endTime,
                allDay: false,
                guia: (value[key]).guia_id[1]
            });

         
        }       
        self.cargar = false;       
        self.calendar.eventSource = events;
        self.mensaje = JSON.stringify(value);

      });
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

    moment.locale('es');
		let start = moment(evt.startTime).format('LLLL');
		let end = moment(evt.endTime).format('LLLL');

		let alert = this.alertCtrl.create({
		  title: '' + evt.title,
		  subTitle: 'De: ' + start + ' A: ' + end + '<br> Guia: ' + evt.guia,
		  buttons: ['OK']
		});
		alert.present();
	}
}
