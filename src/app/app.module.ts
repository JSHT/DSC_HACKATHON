import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { MatSliderModule } from '@angular/material/slider';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { CrudService } from './service/crud.service';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TextareaAutosizeModule,
    FormsModule,
    AngularFireDatabaseModule,
    MatSliderModule,
    BrowserModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyA-bbyzOkvxFKellASEbX2jHBXVpzDKAP8",
      authDomain: "firestorage-image.firebaseapp.com",
      projectId: "firestorage-image",
      storageBucket: "firestorage-image.appspot.com",
      messagingSenderId: "458252237465",
      appId: "1:458252237465:web:18028eac3702f578515608"
    }),
    BrowserAnimationsModule
  ],
  providers: [CrudService],
  bootstrap: [AppComponent]
})
export class AppModule { }
