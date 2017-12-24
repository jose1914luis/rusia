import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Network} from '@ionic-native/network';
import {Storage} from '@ionic/storage';
import {HomePage} from '../../pages/home/home';
import {CrearCuentaPage} from '../../pages/crear-cuenta/crear-cuenta';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {


    loginData = {password: '', username: ''};
    CONEXION = {
        url: 'http://moscutourgratis.com',
        port: '8069',
        db: 'Tour_Gratis_Rusia',
        username: 'jose1914luis@gmail.com',
        password: 'Tour2018',
    };
    cargar = true;
    mensaje = '';
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public alertCtrl: AlertController, private network: Network) {

        var borrar = this.navParams.get('borrar');
        //this.CONEXION.username = (this.navParams.get('login') == undefined)?'' : this.navParams.get('login');
        if (borrar == true) {
            this.cargar = false;
            this.storage.remove('CONEXION');
            this.storage.remove('res.users');
            this.storage.remove('tours.guia');
            this.storage.remove('tours.clientes.faq');
            this.storage.remove('tours.companies');
            this.storage.remove('tours.promociones');
            this.storage.remove('tours.eventos');
        } else {

            this.conectarApp(false);
        }
    }

    loginSinDatos() {
        var self = this;
        this.storage.get('res.users').then((val) => {
            if (val == null) {//no existe datos

                self.presentAlert('Falla!', 'Imposible conectarse');
            } else {

                self.navCtrl.setRoot(HomePage);
            }
            self.cargar = false;
        });
    }

    conectarApp(verificar) {

        var self = this;
        if (this.network.type == 'unknown' || this.network.type == 'none') {// no hay conexion
            //if(this.network.type.toLowerCase() == 'unknown' || this.network.type.toLowerCase() == 'none'){// no hay conexion
            self.cargar = true;
            this.loginSinDatos();
        } else {

            this.storage.get('CONEXION').then((val) => {
                var con;
                if (val == null) {//no existe datos         
                    self.cargar = false;
                    con = self.CONEXION;
                    if (con.username.length < 3 || con.password.length < 3) {

                        if (verificar) {
                            self.presentAlert('Alerta!', 'Por favor ingrese usuario y contraseña');
                        }
                        return;
                    }

                } else {
                    //si los trae directamente ya fueron verificados
                    con = val;
                    if (con.username.length < 3 || con.password.length < 3) {
                        return self.cargar = false;
                    }
                }
                self.cargar = true;
                //var odoo = new Odoo(con);
                var odoo = new OdooApi(PROXY, con.db);
                odoo.login(con.username, con.password).then(
                    function (uid) {
                        

                        odoo.search_read('res.users', [['login', '=', 'jose1914luis@gmail.com']], ['id', 'login', 'user_email', 'image', 'name']).then(
                            function (value) {
                                
                                var user = {id: null, name: null, image: null, login: null, cliente_id: null};
                                //self.mensaje += JSON.stringify(value);
                                if (value.length > 0) {

                                    self.storage.set('CONEXION', con);
                                    user.id = value[0].id;
                                    user.name = value[0].name;
                                    user.image = value[0].image;
                                    user.login = value[0].login;
                                } else {
                                    self.cargar = false;
                                    return self.presentAlert('Falla!', 'Usuario incorrecto');
                                }
                                odoo.search_read('tours.clientes', [['uid', '=', user.id]], ['id', 'name', 'uid']).then(
                                    function (value2) {
                                        if (value2.length > 0) {
                                            user.cliente_id = value2[0].id;
                                        } else {
                                            self.cargar = false;
                                            return self.presentAlert('Falla!', 'Usuario incorrecto');
                                        }

                                        self.storage.set('res.users', user);//guardo en tabla local
                                        self.navCtrl.setRoot(HomePage); //-> me voy para la home page

                                    },
                                    function () {
                                        //console.log('error mostrando ids');
                                        //self.mensaje += 'error mostrando ids';
                                        return self.loginSinDatos();
                                    }
                                );
                            },
                            function () {
                                //console.log('error mostrando ids');
                                //self.mensaje += 'error mostrando ids';
                                return self.loginSinDatos();
                            }
                        );
                    },
                    function () {
                        //console.log('error tranando de conectarme');
                        //self.mensaje += 'error tranando de conectarme';
                        return self.loginSinDatos();
                    }
                );                
            });
        }

    }

    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }
    crearCuenta() {
        this.navCtrl.push(CrearCuentaPage);
    }



}
