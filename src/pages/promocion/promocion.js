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
import { DomSanitizer } from '@angular/platform-browser';
import { PromoDetailPage } from '../../pages/promo-detail/promo-detail';
/**
 * Generated class for the PromocionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PromocionPage = /** @class */ (function () {
    //promocion = {city:'', numero:0, items:[]};
    function PromocionPage(navCtrl, navParams, alertCtrl, _DomSanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this._DomSanitizer = _DomSanitizer;
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
            self.odoo.execute_kw('tours.promociones', 'search', params, function (err2, value2) {
                if (err2) {
                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                }
                var inParams2 = [];
                inParams2.push(value2); //ids
                var params = [];
                params.push(inParams2);
                self.odoo.execute_kw('tours.promociones', 'read', params, function (err3, value3) {
                    if (err2) {
                        return console.log(err3);
                    }
                    self.cargar = false;
                    for (var key in value3) {
                        (value3[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value3[key]).promocion);
                        (value3[key]).city = (value3[key]).city_id[1];
                        self.items.push(value3[key]);
                    }
                });
            });
        });
    }
    PromocionPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    PromocionPage.prototype.ionViewDidLoad = function () {
    };
    PromocionPage.prototype.showImagen = function (item) {
        this.navCtrl.push(PromoDetailPage, { promo: item.name, image: item.promocion2 });
    };
    PromocionPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-promocion',
            templateUrl: 'promocion.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController, DomSanitizer])
    ], PromocionPage);
    return PromocionPage;
}());
export { PromocionPage };
//# sourceMappingURL=promocion.js.map