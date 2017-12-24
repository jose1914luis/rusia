import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {Storage} from '@ionic/storage';
import {ListPage} from '../../pages/list/list';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery';
import {AndroidPermissions} from '@ionic-native/android-permissions';

declare var OdooApi: any;
@IonicPage()
@Component({
    selector: 'page-punto',
    templateUrl: 'punto.html',
})
export class PuntoPage {


    items = [];
    cargar = true;
    mensaje = '';
    proxy = '/api';
    //proxy = 'http://moscutourgratis.com:8069';
    
    constructor(private androidPermissions: AndroidPermissions, public photoViewer: PhotoViewer, public base64ToGallery: Base64ToGallery, public navCtrl: NavController, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.CAMERA]);
        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {
                var con = val;
                var odoo = new OdooApi(this.proxy, con.db);
                this.storage.get('tours.companies').then((val) => {
                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function (uid){
                                odoo.search_read('tours.companies', [['id', '<>', '0']], ['id', 'name', 'punto_encuentro', 'url_map', 'phone', 'mapa']).then(
                                    function (value){
                                        for (var key in value) {
                                            (value[key]).name = (value[key]).name[1];
                                            (value[key]).punto_encuentro2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value[key]).punto_encuentro);
                                            self.items.push((value[key]));
                                        }
                                        self.cargar = false;
                                        self.storage.set('tours.companies', self.items);
                                    },
                                    function (){
                                        self.cargar = false;
                                        self.presentAlert('Falla!', 'Imposible conectarse');
                                    }
                                );
                            },
                            function (){
                                self.cargar = false;
                                self.presentAlert('Falla!', 'Imposible conectarse');
                            }
                        );                                                
                    } else {

                        for (var key in val) {
                            (val[key]).punto_encuentro2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (val[key]).punto_encuentro);
                            self.items.push((val[key]));
                        }
                        self.cargar = false;
                    }
                });
            }
        });
    }

    zoomImage(imageData) {

        var self = this;

        this.base64ToGallery.base64ToGallery(imageData.punto_encuentro, {prefix: 'img_', mediaScanner: true}).then(
            res => {
                self.photoViewer.show(res, imageData.name);
            },
            err => {
                self.presentAlert('Falla', 'Error al cargar la imagen: ' + JSON.stringify(err));
            }
        );
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad PuntoPage');
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
