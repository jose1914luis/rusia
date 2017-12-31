import {NavController, ModalController, AlertController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Network} from '@ionic-native/network';
import {Storage} from '@ionic/storage';
import {ListPage} from '../../pages/list/list';
import {EvenDetailPage} from '../even-detail/even-detail';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    selectedDay = new Date();

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
    mensaje = '';
    cargar = true;
    viewTitle = '';
    fecha = new Date();
    constructor(private network: Network, public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage) {
        //this.homeSinDatos();
        var self = this;

        //console.log(this.network.type);
        if (this.network.type == 'unknown' || this.network.type == 'none') {// no hay conexion
            self.cargar = true;
            this.homeSinDatos();
        } else {

            this.storage.get('CONEXION').then((val) => {
                if (val == null) {
                    self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
                } else {// se encontraron datos para la conexion 
                    self.cargar = true;
                    var con = val;
                    var odoo = new OdooApi(PROXY, con.db);
                    odoo.login(con.username, con.password).then(

                        function (uid) {
                            //console.log('entro' + uid);
                            //Si estoy conectado debo primero actualizar las solicitudes
                            self.storage.get('tours.eventos').then((val) => {
                                //self.mensaje += '1';
                                let tabla_eventos_local = val;
                                //self.mensaje += 'tabla_eventos_local:'+ JSON.stringify(tabla_eventos_local);
                                let events = [];

                                self.storage.get('res.users').then((val) => {
                                    //self.mensaje += '2';
                                    let usuario = val;
                                    var inParams = [];
                                    for (var key in tabla_eventos_local) {

                                        if ((tabla_eventos_local[key]).estado == 'pendiente') {
                                            inParams.push({
                                                name: usuario.cliente_id,
                                                tour_id: (tabla_eventos_local[key]).tour_id,
                                                state: 'borrador',
                                                num_person: (tabla_eventos_local[key]).num_person
                                            });
                                        }

                                        if ((tabla_eventos_local[key]).home == true) {
                                            events.push({
                                                title: (tabla_eventos_local[key]).title,
                                                startTime: new Date((tabla_eventos_local[key]).startTime),
                                                endTime: new Date((tabla_eventos_local[key]).endTime),
                                                allDay: false,
                                                description: (tabla_eventos_local[key]).description,
                                                guia: (tabla_eventos_local[key]).guia,
                                                ubicacion: (tabla_eventos_local[key]).ubicacion,
                                                estado: (tabla_eventos_local[key]).estado,
                                                home: (tabla_eventos_local[key]).home
                                            });
                                        }
                                    }
                                    //self.mensaje += '3';
                                    var params = [];
                                    params.push(inParams);
                                    //self.mensaje += 'Parametros'+ JSON.stringify(inParams);
                                    //console.log(inParams);
                                    odoo.create('tours.clientes.solicitudes', inParams).then(
                                        function (value_c) {
                                            odoo.search_read('tours.clientes.solicitudes', [['id', '<>', '0']], ['id', 'name', 'tour_id', 'state', 'num_person']).then(
                                                function (value_s) {
                                                    //console.log(value_s);
                                                    self.storage.remove('tours.guia');
                                                    self.storage.get('tours.guia').then((val) => {
                                                        
                                                        //console.log(val);
                                                        if (val == null) {
                                                            //Traigo todos los eventos proximos                
                                                            odoo.search_read('tours.guia', [['id', '<>', '0']], ['id', 'guia_id', 'tour_id', 'date_begin', 'date_end']).then(

                                                                function (value) {
                                                                    //console.log(value);
                                                                    odoo.search_read('tours', [['id', '<>', '0']], ['id', 'name', 'codigo', 'description', 'company_id']).then(
                                                                        function (value2) {
                                                                            var eventsProx = [];

                                                                            for (var key in value) {
                                                                                var dateStart = new Date((value[key]).date_begin.replace(' ', 'T'));
                                                                                var dateEnd = new Date((value[key]).date_end.replace(' ', 'T'));//new Date((value[key]).date_end);
                                                                                var startTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes());
                                                                                var endTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate(), dateEnd.getHours(), dateEnd.getMinutes());
                                                                                //console.log(startTime);
                                                                                for (var key2 in value2) {
                                                                                    if (value2[key2].id == (value[key]).tour_id[0]) {

                                                                                        var evento = {
                                                                                            title: (value2[key2]).name,
                                                                                            startTime: startTime,
                                                                                            endTime: endTime,
                                                                                            allDay: false,
                                                                                            description: (value2[key2]).description,
                                                                                            guia: (value[key]).guia_id[1],
                                                                                            ubicacion: (value2[key2]).company_id[1],
                                                                                            estado: null,
                                                                                            tour_id: value[key].id,
                                                                                            home: false
                                                                                        }

                                                                                        for (var key_s in value_s) {
                                                                                            //console.log('for');
                                                                                            if (value_s[key_s].tour_id[0] == value[key].id) {
                                                                                                evento.estado = value_s[key_s].state;
                                                                                                events.push(evento);
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        eventsProx.push(evento);
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                                                            self.storage.set('tours.guia', eventsProx); //si tiene eventos precargados
                                                                            self.cargar = false;
                                                                            self.calendar.eventSource = events;
                                                                            self.storage.set('tours.eventos', events);
                                                                            //console.log('calendario');
                                                                            //console.log(JSON.stringify(self.calendar.eventSource));
                                                                        },
                                                                        function () {
                                                                            self.cargar = false;
                                                                            return self.homeSinDatos();
                                                                        }
                                                                    );
                                                                },
                                                                function () {
                                                                    self.cargar = false;
                                                                    return self.homeSinDatos();
                                                                }
                                                            );
                                                        } else {

                                                            //console.log('se cargan en local');
                                                            var eventsProx = [];

                                                            for (var key in val) {

                                                                var evento = {
                                                                    title: (val[key]).title,
                                                                    startTime: new Date((val[key]).startTime),
                                                                    endTime: new Date((val[key]).endTime),
                                                                    allDay: false,
                                                                    description: (val[key]).description,
                                                                    guia: (val[key]).guia,
                                                                    ubicacion: (val[key]).ubicacion,
                                                                    tour_id: (val[key]).tour_id,
                                                                    estado: null,
                                                                    home: false
                                                                }
                                                                for (var key_s in value_s) {
                                                                    if (value_s[key_s].tour_id[0] == val[key].tour_id) {
                                                                        evento.estado = value_s[key_s].state;
                                                                        events.push(evento);
                                                                        break;
                                                                    }
                                                                }
                                                                eventsProx.push(evento);

                                                            }


                                                            //self.mensaje += 'entro por aca';
                                                            self.storage.set('tours.guia', eventsProx); //si tiene eventos precargados
                                                            self.cargar = false;
                                                            self.calendar.eventSource = events;
                                                            self.storage.set('tours.eventos', events);
                                                            //.log(events);
                                                        }
                                                    });

                                                },
                                                function () {
                                                    self.cargar = false;
                                                    return self.homeSinDatos();
                                                }
                                            );
                                        },
                                        function () {
                                            console.log('error creando tours.clientes.solicitudes');
                                        }
                                    );
                                });
                            });
                        },
                        function () {
                            return self.homeSinDatos();
                        }
                    );
                }
            });
        }
    }

    homeSinDatos() {


        var self = this;
        self.storage.get('tours.eventos').then((val) => {

            var events = [];

            for (var key in val) {

                //self.mensaje += 'entro_ una';
                events.push({
                    title: (val[key]).title,
                    startTime: new Date((val[key]).startTime),
                    endTime: new Date((val[key]).endTime),
                    allDay: false,
                    description: (val[key]).description,
                    guia: (val[key]).guia,
                    ubicacion: (val[key]).ubicacion,
                    tour_id: (val[key]).tour_id,
                    estado: val[key].estado,
                    home: val[key].home
                });
            }

            self.cargar = false;
            self.calendar.eventSource = events;
            self.storage.set('tours.eventos', events);
        });
    }

    onCurrentDateChanged(event: Date) {
        this.fecha = event;
    }

    addEvent() {

        let modal = this.modalCtrl.create(EvenDetailPage, {startTime: new Date(this.fecha), endTime: new Date(this.fecha), home: true, nuevo: true, editable: true});
        modal.present();
        modal.onDidDismiss(data => {
            if (data) {

                let eventData = data;
                //console.log(data.startTime);
                eventData.startTime = new Date(data.startTime);
                //console.log(eventData.startTime);
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

    onEventSelected(evt) {

        this.navCtrl.push(EvenDetailPage, {
            title: evt.title,
            startTime: evt.startTime,
            endTime: evt.endTime,
            description: evt.description,
            guia: evt.guia,
            ubicacion: evt.ubicacion,
            home: true,
            estado: evt.estado,
            editable: false
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
