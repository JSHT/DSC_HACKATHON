import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];
  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
    // console.log(item.roomname);
  });

  return returnArr;
};


@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  isLoadingResults = true;
  static loginTime: any;

  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname');
    firebase.default.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      this.isLoadingResults = false;


    });
  }

  ngOnInit(): void {
  }

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.default.database().ref('chats/').push();
    newMessage.set(chat);

    // implement enter room time
    const entryTime = { roomname: '', nickname: '', date: '' };
    entryTime.roomname = roomname;
    entryTime.nickname = this.nickname;
    entryTime.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const newEntry = firebase.default.database().ref('entrys/').push();
    newEntry.set(entryTime);
    var presenceRef = firebase.default.database().ref('entrys/' + newEntry.key);
    // Write a string when this client loses connection
    presenceRef.onDisconnect().remove();


    firebase.default.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).once('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.default.database().ref('roomusers/' + user.key);
        userRef.update({ status: 'online' });
        console.log("in");
        var presenceRef = firebase.default.database().ref('roomusers/' + user.key);
        // Write a string when this client loses connection

        presenceRef.onDisconnect().update({ status: 'offline' });
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.default.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
        var presenceRef = firebase.default.database().ref('roomusers/' + newRoomUser.key);
        presenceRef.onDisconnect().update({ status: "offline" });
      }
    });

    this.router.navigate(['/chatroom', roomname]);
  }

  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

}
