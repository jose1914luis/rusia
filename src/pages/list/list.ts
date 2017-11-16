import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';
import  * as Odoo from 'odoo-xmlrpc';
import { CrearCuentaPage } from '../../pages/crear-cuenta/crear-cuenta';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  
  loginData = {password:'', username:''};
  CONEXION = {
    url: 'http://moscutourgratis.com',
    port: '8069',
    db: 'Tour_Gratis_Rusia',
    username: '',//username: 'fernandez.bermudez.jonatan@gmail.com'
    password: '',//password: '123456',    
  };  
  cargar = false;
  mensaje = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public alertCtrl: AlertController) {
    
    var borrar = this.navParams.get('borrar');
    this.CONEXION.username = this.navParams.get('login');
    if(borrar == true){
      this.storage.set('CONEXION', null);
      this.storage.set('res.users', null);
      this.storage.set('tours.guia', null);
      this.storage.set('tours.clientes.faq', null);
      this.storage.set('tours.companies', null);
      this.storage.set('tours.promociones', null);
      this.storage.set('tours.eventos', null);
    }else{
      this.doLogin(false);
    }   
  }

  doLogin(verificar){

    var self = this;
    this.storage.get('CONEXION').then((val) => {
      var con;
      if(val == null){//no existe datos
        //verifico que ingrese los datos
        con = this.CONEXION

        if(con.username.length < 3 || con.password.length < 3){

          if(verificar){
            self.presentAlert('Alerta!','Por favor ingrese usuario y contraseña');  
          }          
          return;
        }
      }else{                
        //si los trae directamente ya fueron verificados
        con = val;
      }
      self.cargar = true;
      var odoo = new Odoo(con);
      odoo.connect(function (err) {  
        //self.mensaje = JSON.stringify(valuepru);
        if (err) { 
          self.cargar = false;
          return self.presentAlert('Falla!', 
            'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
        }      
        var inParams = [];
        inParams.push([['login', '=', con.username]]);  
        inParams.push(['id', 'login', 'user_email', 'image', 'name']); //fields 
        var params = [];
        params.push(inParams);
        odoo.execute_kw('res.users', 'search_read', params, function (err2, value) {

          if (err2) {
            self.cargar = false;
            return self.presentAlert('Falla!', 
              'Error: '+ JSON.stringify(err2, Object.getOwnPropertyNames(err2)) );
          }

          var user = {id:null,name:null,image:null,login:null,cliente_id:null};
          for (var key in value) {     
            if(value[key].login == con.username || value[key].user_email == con.username){

              self.storage.set('CONEXION', con);
              user.id = value[key].id;
              user.name = value[key].name;
              user.image = value[key].image;
              user.login = value[key].login;              
              /*
              id= value[key].id;*/
              break;
              //self.navCtrl.setRoot(HomePage);              
            }
          }
//self.mensaje += 'entro';
          var inParams = [];
          inParams.push([['uid', '=', user.id]]);
          inParams.push(['id', 'name', 'uid']); //fields
          inParams.push(0); //offset
          inParams.push(5); //limit
          var params = [];
          params.push(inParams);
          odoo.execute_kw('tours.clientes', 'search_read', params, function (err3, value2) {
            //self.mensaje += 'entro';
              if (err3) {
                self.cargar = false;
                return self.presentAlert('Falla!', 
                  'Error: '+ JSON.stringify(err3, Object.getOwnPropertyNames(err3)) );
              }

              
              //self.mensaje += JSON.stringify(value2);
              for (var key in value2) {
                user.cliente_id = value2[key].id;//[value2[key].id, value2[key].name];
              }

              self.storage.set('res.users', user);
              self.navCtrl.setRoot(HomePage);
              //self.mensaje += JSON.stringify(user);
          });

          
        });
      });    
    });
    /*this.navCtrl.setRoot(HomePage);*/
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });
    alert.present();
  }
  crearCuenta(){
    this.navCtrl.push(CrearCuentaPage);
  }

}
