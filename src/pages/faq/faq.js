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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as Odoo from 'odoo-xmlrpc';
import { CONEXION } from '../../providers/constants/constants';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FaqPage = /** @class */ (function () {
    function FaqPage(navCtrl, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.odoo = new Odoo(CONEXION);
        this.items = [];
        this.cargar = true;
        var self = this;
        this.odoo.connect(function (err) {
            if (err) {
                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }
            var inParams = [];
            inParams.push([['id', '<>', '0']]);
            var params = [];
            params.push(inParams);
            self.odoo.execute_kw('tours.clientes.faq', 'search', params, function (err2, value2) {
                if (err2) {
                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                }
                var inParams2 = [];
                inParams2.push(value2); //ids
                var params = [];
                params.push(inParams2);
                self.odoo.execute_kw('tours.clientes.faq', 'read', params, function (err3, value3) {
                    if (err2) {
                        return console.log(err3);
                    }
                    self.cargar = false;
                    for (var key in value3) {
                        (value3[key]).icon = 'arrow-dropdown-circle';
                        (value3[key]).visible = false;
                        self.items.push((value3[key]));
                    }
                });
            });
        });
    }
    FaqPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    FaqPage.prototype.ionViewDidLoad = function () {
        //console.log('ionViewDidLoad FaqPage');
    };
    FaqPage.prototype.showResponse = function (item) {
        if (item.visible) {
            item.visible = false;
            item.icon = 'arrow-dropup-circle';
        }
        else {
            item.visible = true;
            item.icon = 'arrow-dropdown-circle';
        }
    };
    FaqPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-faq',
            templateUrl: 'faq.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController])
    ], FaqPage);
    return FaqPage;
}());
export { FaqPage };
//# sourceMappingURL=faq.js.map