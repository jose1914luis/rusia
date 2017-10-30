var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
var PuntoPage = /** @class */ (function () {
    function PuntoPage(navCtrl, alertCtrl, _DomSanitizer, storage) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this._DomSanitizer = _DomSanitizer;
        this.storage = storage;
        this.odoo = new Odoo(CONEXION);
        this.items = [];
        this.cargar = true;
        // this.mapa = this._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==');
        var self = this;
        self.items = [];
        this.storage.get('tours.companies').then(function (val) {
            if (val == null) {
                self.odoo.connect(function (err) {
                    if (err) {
                        return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                    }
                    var inParams = [];
                    inParams.push([['id', '<>', '0']]);
                    var params = [];
                    params.push(inParams);
                    self.odoo.execute_kw('tours.companies', 'search', params, function (err2, value2) {
                        if (err2) {
                            return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                        }
                        var inParams2 = [];
                        inParams2.push(value2); //ids
                        var params = [];
                        params.push(inParams2);
                        self.odoo.execute_kw('tours.companies', 'read', params, function (err3, value3) {
                            if (err3) {
                                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                            }
                            self.cargar = false;
                            for (var key in value3) {
                                (value3[key]).name = (value3[key]).name[1];
                                (value3[key]).punto_encuentro2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value3[key]).punto_encuentro);
                                self.items.push((value3[key]));
                            }
                        });
                    });
                });
            }
            else {
                for (var key in val) {
                    (val[key]).mapa2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (val[key]).mapa);
                    self.items.push((val[key]));
                }
                self.cargar = false;
            }
        });
    }
    PuntoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PuntoPage');
    };
    PuntoPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    PuntoPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-punto',
            templateUrl: 'punto.html',
        }),
        __metadata("design:paramtypes", [NavController, AlertController, DomSanitizer, Storage])
    ], PuntoPage);
    return PuntoPage;
}());
export { PuntoPage };
//# sourceMappingURL=punto.js.map