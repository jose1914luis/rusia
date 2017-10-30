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
import { NavController, ModalController, AlertController } from 'ionic-angular';
//import { Calendar } from '@ionic-native/calendar';
//import { NgCalendarModule  } from 'ionic2-calendar';
import { EventModalPage } from '../../pages/event-modal/event-modal';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, modalCtrl, alertCtrl, storage) {
        // var prueba = [];
        // this.storage.get('items1').then((val) => {
        //   console.log(val);
        //   if(val == null){
        //     console.log('normal');
        //   }else{
        //     console.log('se carga');
        //   }
        // });
        // console.log(prueba);
        // console.log((prueba == []));
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.selectedDay = new Date();
        this.eventSource = [];
        this.calendar = {
            mode: 'month',
            currentDate: new Date(),
            locale: 'es-RU'
        };
        //this.storage.set('items', null);
    }
    HomePage.prototype.onCurrentDateChanged = function (evt) {
    };
    HomePage.prototype.reloadSource = function (start, end) {
    };
    HomePage.prototype.onEventSelected = function (evt) {
        var start = moment(evt.startTime).format('LLLL');
        var end = moment(evt.endTime).format('LLLL');
        var alert = this.alertCtrl.create({
            title: '' + evt.title,
            subTitle: 'From: ' + start + '<br>To: ' + end,
            buttons: ['OK']
        });
        alert.present();
    };
    HomePage.prototype.onViewTitleChanged = function (evt) {
    };
    HomePage.prototype.onTimeSelected = function (evt) {
        this.selectedDay = evt.selectedTime;
    };
    HomePage.prototype.addEvent = function () {
        var _this = this;
        var modal = this.modalCtrl.create(EventModalPage, { selectedDay: this.selectedDay });
        modal.present();
        modal.onDidDismiss(function (data) {
            if (data) {
                var eventData = data;
                eventData.startTime = new Date(data.startTime);
                eventData.endTime = new Date(data.endTime);
                var events_1 = _this.eventSource;
                events_1.push(eventData);
                _this.eventSource = [];
                setTimeout(function () {
                    _this.eventSource = events_1;
                });
            }
        });
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, ModalController, AlertController, Storage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map