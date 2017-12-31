import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {EvenDetailPage} from '../even-detail/even-detail';
import {ListPage} from '../../pages/list/list';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
@Component({
    selector: 'page-proximo',
    templateUrl: 'proximo.html',
})
export class ProximoPage {


    calendar = {
        eventSource: [],
        mode: 'month',
        currentDate: new Date(),
        locale: 'es-RU',
        formatDayHeader: 'E',
        noEventsLabel: 'Sin Eventos',
        formatMonthTitle: 'MMMM yyyy',
        allDayLabel: 'Todo el día',
        formatWeekTitle: 'MMMM yyyy, Se $n'
    };

    items = [];
    cargar = true;
    viewTitle = '';
    //mensaje = '';
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {

        var self = this;
        self.calendar.eventSource = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {
            
                var con = val;
                var odoo = new OdooApi(PROXY, con.db);
                this.storage.get('tours.guia').then((val) => {

                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function(uid){
                                
                                odoo.search_read('tours.guia', [['id', '<>', '0']], ['id', 'guia_id', 'tour_id', 'date_begin', 'date_end']).then(
                                    function(value){
                                        
                                        odoo.search_read('tours', [['id', '<>', '0']], ['id', 'name', 'codigo', 'description', 'company_id']).then(
                                            
                                            function(value2){
                                                               
                                                var events = [];
                                                for (var key in value) {

                                                    //var dateStart = new Date((value[key]).date_begin);
                                                    //var dateEnd = new Date((value[key]).date_end);
                                                    var dateStart = new Date((value[key]).date_begin.replace(' ', 'T'));
                                                    var dateEnd = new Date((value[key]).date_end.replace(' ', 'T'));//new Date((value[key]).date_end);
                                                    var startTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes());
                                                    var endTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate(), dateEnd.getHours(), dateEnd.getMinutes());
                                                    for (var key2 in value2) {
                                                        if (value2[key2].id == (value[key]).tour_id[0]) {
                                                            events.push({
                                                                title: (value2[key2]).name,
                                                                startTime: startTime,
                                                                endTime: endTime,
                                                                allDay: false,
                                                                description: (value2[key2]).description,
                                                                guia: (value[key]).guia_id[1],
                                                                ubicacion: (value2[key2]).company_id[1],
                                                                tour_id: (value[key]).id
                                                            });
                                                            break;
                                                        }
                                                    }
                                                }
                                                self.cargar = false;
                                                self.calendar.eventSource = events;
                                                self.storage.set('tours.guia', events);              
                                            },
                                            function(){
                                                return self.presentAlert('Falla!','Error de conexion');
                                            }
                                        );
                                                                    
                                    },
                                    function(){
                                        return self.presentAlert('Falla!','Error de conexion');
                                    }
                                );

                            },
                            function(){
                                return self.presentAlert('Falla!','Error de conexion');
                            }
                        );
                        
                    } else {

                        var events = [];
                        for (var key in val) {
                            events.push({
                                title: (val[key]).title,
                                startTime: new Date((val[key]).startTime),
                                endTime: new Date((val[key]).endTime),
                                allDay: false,
                                description: (val[key]).description,
                                estado: val[key].estado,
                                guia: (val[key]).guia,
                                ubicacion: (val[key]).ubicacion,
                                tour_id: (val[key]).tour_id,
                                home: false
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

    onEventSelected(evt) {

        let evento = {
            title: evt.title,
            startTime: evt.startTime,
            endTime: evt.endTime,
            description: evt.description,
            guia: evt.guia,
            ubicacion: evt.ubicacion,
            tour_id: evt.tour_id,
            estado: evt.estado,
            home: false,
            editable: false
        };

        if (evt.estado != null) {
            this.navCtrl.push(EvenDetailPage, evento);
        } else {
            evt.home = true;
            let modal = this.modalCtrl.create(EvenDetailPage, evento);
            modal.present();
            var self = this;
            modal.onDidDismiss(data => {
                if (data) {

                    self.storage.get('tours.eventos').then((val) => {
                        //actualizo el home
                        val.push(data);
                        console.log(val);
                        self.storage.set('tours.eventos', val);
                    });

                    self.storage.get('tours.guia').then((val) => {

                        let events = self.calendar.eventSource;
                        self.calendar.eventSource = [];
                        for (var key in events) {
                            if (events[key].tour_id == evt.tour_id && evt.startTime == events[key].startTime) {

                                let eventData = data; //->busco el evento original y lo reemplazo 
                                eventData.startTime = new Date(data.startTime);
                                eventData.endTime = new Date(data.endTime);
                                events[key] = eventData;
                                break;
                            }
                        }
                        setTimeout(() => {
                            this.calendar.eventSource = events;
                            this.storage.set('tours.guia', events);
                        });

                    });
                }
            });
        }
    }
}
