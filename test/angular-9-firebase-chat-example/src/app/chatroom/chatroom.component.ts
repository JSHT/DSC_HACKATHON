import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { RoomlistComponent } from '../roomlist/roomlist.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray2 = (snapshot: any, name: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    var userRef;
    var userEn;
    var user;
    firebase.database().ref('entrys/').orderByChild('nickname').equalTo(name).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      user = roomuser.find(x => x.nickname === name);
    });
    console.log("hello world");
    console.log(user.date);
    console.log(item.date);
    console.log(item.date > user.date);
    if (item.date > user.date) {
      console.log("super item");
      console.log(item);

      returnArr.push(item);
    }
  });

  console.log("returnArr");
  console.log(returnArr);
  return returnArr;
};

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    // firebase.database().ref('entrys/').orderByChild('nickname').equalTo()
    // if Date.parse(item.date) > Date.parse()
    returnArr.push(item);
    console.log("item");
    console.log(item);
  });

  console.log("returnArr");
  console.log(returnArr);
  return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname');
    this.roomname = this.route.snapshot.params.roomname;




    firebase.database().ref('chats/').on('value', resp => {
      console.log("resp");
      console.log(resp);
      this.chats = [];
      this.chats = snapshotToArray2(resp, this.nickname);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });
    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
      console.log("resp2");
      console.log(resp2);
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).once('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({ status: 'offline' });
      }
    });

    // 把進入紀錄刪掉
    firebase.database().ref('entrys/').orderByChild('nickname').equalTo(this.nickname).once('value', (resp: any) => {
      let niUser = [];
      niUser = snapshotToArray(resp);
      var user = niUser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('entrys/' + user.key);
        userRef.remove();
      }
    });

    this.router.navigate(['/roomlist']);
  }

}
