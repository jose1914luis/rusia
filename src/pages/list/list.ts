import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';
import { CrearCuentaPage } from '../../pages/crear-cuenta/crear-cuenta';
import  * as Odoo from 'odoo-xmlrpc';

//import { Observable } from 'rxjs/Rx';

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
    username: '',
    password: '',
  };  
  cargar = true;
  mensaje = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public alertCtrl: AlertController, private network: Network) {       

    var borrar = this.navParams.get('borrar');    
    this.CONEXION.username = this.navParams.get('login');
    if(borrar == true){
      this.cargar = false;
      this.storage.set('CONEXION', null);
      this.storage.set('res.users', null);
      this.storage.set('tours.guia', null);
      this.storage.set('tours.clientes.faq', null);
      this.storage.set('tours.companies', null);
      this.storage.set('tours.promociones', null);
      this.storage.set('tours.eventos', null);
    }else{

      this.conectarApp(false);
    }     
  }

  loginSinDatos(){
    var self = this;
    this.storage.get('res.users').then((val) => {
       if(val == null){//no existe datos
         
         self.presentAlert('Falla!', 'Imposible conectarse' );
       }else{
         
         self.navCtrl.setRoot(HomePage);
       }
       self.cargar = false;
    });
  } 
   
  conectarApp(verificar){

    var self = this;
    
    if(this.network.type.toLowerCase() == 'unknown' || this.network.type.toLowerCase() == 'none'){// no hay conexion
    //if(this.network.type.toLowerCase() == 'unknown' || this.network.type.toLowerCase() == 'none'){// no hay conexion
      self.cargar = true;
      this.loginSinDatos();
    }else{

      this.storage.get('CONEXION').then((val) => {
        var con;
        if(val == null){//no existe datos         
          self.cargar = false;
          con = this.CONEXION;
          if(con.username.length < 3 || con.password.length < 3){

            if(verificar){
              self.presentAlert('Alerta!','Por favor ingrese usuario y contraseña');  
            }          
            return;
          }

        }else{                
          //si los trae directamente ya fueron verificados
          con = val;
          if(con.username.length < 3 || con.password.length < 3){    
            return self.cargar = false;
          }
        }
        self.cargar = true;
        var odoo = new Odoo(con);
        odoo.connect(function (err) {
          //self.mensaje += 'entro';
          if (err) { 
            return self.loginSinDatos();
          }      
          var inParams = [];
          inParams.push([['login', '=', con.username]]);  
          inParams.push(['id', 'login', 'user_email', 'image', 'name']); //fields 
          var params = [];
          params.push(inParams);
          odoo.execute_kw('res.users', 'search_read', params, function (err, value) {

            if (err) {
              return self.loginSinDatos();
            }
            var user = {id:null,name:null,image:null,login:null,cliente_id:null};
            //self.mensaje += JSON.stringify(value);
            if(value.length > 0){

               self.storage.set('CONEXION', con);
               user.id = value[0].id;
               user.name = value[0].name;
               user.image = value[0].image;
               user.login = value[0].login; 
            }else{
              self.cargar = false;
              return self.presentAlert('Falla!', 'Usuario incorrecto' );
            }
                        

            var inParams = [];
            inParams.push([['uid', '=', user.id]]);
            inParams.push(['id', 'name', 'uid']); //fields
            var params = [];
            params.push(inParams);
            odoo.execute_kw('tours.clientes', 'search_read', params, function (err, value2) {
              //self.mensaje += 'entro';
                if (err) {
                  return self.loginSinDatos();
                }
                
                if(value2.length > 0){
                  user.cliente_id = value2[0].id;
                }else{
                  self.cargar = false;
                  return self.presentAlert('Falla!', 'Usuario incorrecto' );
                }                

                self.storage.set('res.users', user);//guardo en tabla local
                /***************************************************************************************
                Guardo el ultimo registro de todas las tablas modificadas
                **************************************************************************************/
                var tablas = [];
                //consultar modificaciones de tablas
                var inParams = [];
                inParams.push([['name', '=', 'tours.guia']]);  
                inParams.push(['id_modify', 'name', 'action']); //fields    
                inParams.push(0); //offset
                inParams.push(1); //limit
                inParams.push('id_modify desc'); //limit
                var params = [];  
                params.push(inParams);        
                odoo.execute_kw('app.logs', 'search_read', params, function (err, value3) {
                if (err) {
                  return self.loginSinDatos();
                }
                if(value3.length > 0){
                  tablas.push({name:value3[0].name, ultimo_id:value3[0].id});
                }

                var inParams = [];
                inParams.push([['name', '=', 'tours.clientes.faq']]);  
                inParams.push(['id_modify', 'name', 'action']); //fields    
                inParams.push(0); //offset
                inParams.push(1); //limit
                inParams.push('id_modify desc'); //limit
                var params = [];  
                params.push(inParams);        
                odoo.execute_kw('app.logs', 'search_read', params, function (err, value3) {
                 
                if (err) {
                  return self.loginSinDatos();
                }

                if(value3.length > 0){
                  tablas.push({name:value3[0].name, ultimo_id:value3[0].id});
                }
                  //self.mensaje += JSON.stringify(value3);
                var inParams = [];
                inParams.push([['name', '=', 'tours.companies']]);  
                inParams.push(['id_modify', 'name', 'action']); //fields    
                inParams.push(0); //offset
                inParams.push(1); //limit
                inParams.push('id_modify desc'); //limit
                var params = [];  
                params.push(inParams);        
                odoo.execute_kw('app.logs', 'search_read', params, function (err, value3) {
                
                if (err) {
                  return self.loginSinDatos();
                }

                if(value3.length > 0){
                  tablas.push({name:value3[0].name, ultimo_id:value3[0].id});
                }

                var inParams = [];
                inParams.push([['name', '=', 'tours.promociones']]);  
                inParams.push(['id_modify', 'name', 'action']); //fields    
                inParams.push(0); //offset
                inParams.push(1); //limit
                inParams.push('id_modify desc'); //limit
                var params = [];  
                params.push(inParams);        
                odoo.execute_kw('app.logs', 'search_read', params, function (err, value3) {
                
                if (err) {
                  return self.loginSinDatos();
                }

                if(value3.length > 0){
                  tablas.push({name:value3[0].name, ultimo_id:value3[0].id});
                }              
                  //self.mensaje += JSON.stringify(tablas);

                  //busco lo ultimo guardado de tablas
                self.storage.get('tablas').then((val) => {
                    
                    if(val != null){

                      for (var key in val) {    

                        for (var key2 in tablas) {  //Resetiar tablas
                          if(val[key].name == 'tours.guia' && tablas[key2].name == 'tours.guia' && val[key2].ultimo_id < tablas[key2].ultimo_id){
                            self.storage.set('tours.guia', null);
                          }
                          if(val[key].name == 'tours.promociones' && tablas[key2].name == 'tours.promociones' && val[key2].ultimo_id < tablas[key2].ultimo_id){
                            self.storage.set('tours.promociones', null);
                          }
                          if(val[key].name == 'tours.companies' && tablas[key2].name == 'tours.companies' && val[key2].ultimo_id < tablas[key2].ultimo_id){
                            self.storage.set('tours.companies', null);
                          }
                          if(val[key].name == 'tours.clientes.faq' && tablas[key2].name == 'tours.clientes.faq' && val[key2].ultimo_id < tablas[key2].ultimo_id){
                            self.storage.set('tours.clientes.faq', null);
                          }
                        }
                      }
                    }
                    self.storage.set('tablas', tablas);//guardo en tabla local
                    self.navCtrl.setRoot(HomePage); //-> me voy para la home page
                });                  
                });                
                });
                });
                });
                /**************************************************************************************/                  
            });            
          });
        });    
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
  crearCuenta(){
    this.navCtrl.push(CrearCuentaPage);
  }

  

}
