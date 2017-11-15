import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import  * as Odoo from 'odoo-xmlrpc';

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

  mensaje = '';
  event_estado = '';
  event_color = '';
  event = {estado_bol:false, estado:null, title:'', startTime:null, endTime:null, allDay: false, description:null, guia: null, ubicacion:null, home:false, tour_id:null}
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private storage: Storage) {
  	this.event.title =  this.navParams.get('title');
  	this.event.startTime =  this.navParams.get('startTime').toISOString();
  	this.event.endTime =  this.navParams.get('endTime').toISOString();
  	this.event.description =  this.navParams.get('description');
  	this.event.guia =  this.navParams.get('guia');
  	this.event.ubicacion =  this.navParams.get('ubicacion');
    this.event.home =  this.navParams.get('home');  	
    this.event.tour_id =  this.navParams.get('tour_id');
    this.event.estado =  this.navParams.get('estado');
    if(this.event.estado == 'borrador'){
      this.event.estado_bol = true;
      this.event_estado = 'Esperando aceptación de solicitud';
      this.event_color = 'danger';
    }else if(this.event.estado == 'aceptado'){

      this.event.estado_bol = true;
      this.event_estado = 'Solicitud Aceptada';
      this.event_color = 'secondary';
    }else if(this.event.estado == 'rechazado'){
      this.event.estado_bol = true;
      this.event_estado = 'Solicitud Rechazada';
      this.event_color = 'danger';
    }

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EvenDetailPage');
  }

  participar(){
    let alert = this.alertCtrl.create({
      title: '¿Desea apuntarse a este tour?',
      message: 'Un gerente validará su petición',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.presentPrompt();
          }
        }
      ]
    });
    alert.present();    
  }

  cancelar(){
    this.viewCtrl.dismiss(null);
  }

  guardar(){
    this.viewCtrl.dismiss(this.event);
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Asistencia',
      inputs: [
        {
          name: 'num_person',
          placeholder: 'Numero de Personas',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continuar',
          handler: data => {

            var self = this;
            //self.mensaje += 'esta entrando';
            self.storage.get('CONEXION').then((val) => {
              //self.mensaje += 'esta2';
              if(val == null){
                self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
              }else{
                var odoo = new Odoo(val);
                odoo.connect(function (err) {
                  //self.mensaje += 'esta3';
                    if (err) { 

                      return self.presentAlert('Falla!', 
                        'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
                    }
                    self.storage.get('res.users').then((val) => {
                      //self.mensaje += 'esta5';
                      if(val == null){
                        self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
                      }else{

                        /*self.mensaje += JSON.stringify({
                          name: val.cliente_id,
                          tour_id: self.event.tour_id,
                          state: 'borrador',
                          num_person:data.num_person
                        });*/
                        var inParams = [];
                        inParams.push({
                          name: val.cliente_id,
                          tour_id: self.event.tour_id,
                          state: 'borrador',
                          num_person:data.num_person
                        });
                        var params = [];
                        params.push(inParams);
                        odoo.execute_kw('tours.clientes.solicitudes', 'create', params, function (err, value) {
                          //self.mensaje += 'Entro hasta el ultimo';
                            if (err) { 

                              return self.presentAlert('Falla!', 
                                'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
                            }
                            self.presentAlert('Alerta!','Has solicitado participar en este tour:<br><b>Estado: Pendiente</b>');
                        });
                      }
                  });
                    
                });                
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }

}
