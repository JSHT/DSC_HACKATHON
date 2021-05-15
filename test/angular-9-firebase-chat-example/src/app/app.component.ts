import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';

const config = {
  apiKey: 'jYNA5xUBOyCZUoXoQYyxgtRESXHtoX6ImimUo5UW',
  databaseURL: 'https://chat-list-c2972-default-rtdb.firebaseio.com'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chat';
  a = new Date();


  constructor() {
    firebase.initializeApp(config);
  }

}
