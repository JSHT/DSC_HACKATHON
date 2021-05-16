import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(public fireservices:AngularFirestore) { }


  create_NewProduct(Record)
  {
      return this.fireservices.collection('Product').add(Record);
  }
}
