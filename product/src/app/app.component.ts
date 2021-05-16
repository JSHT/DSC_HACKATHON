import { Component } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FormsModule} from '@angular/forms';
import {CrudService} from './service/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  path:string;
  Product:string;
  ProductName:string;
  ProductDescription:string;
  ProductPrice:number;
  message:string;
  url:any;


  constructor(private af:AngularFireStorage, public crudservice:CrudService){

  }

  upload($event){
    console.log(1);
      if($event.target.files){
      this.path = $event.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL($event.target.files[0])
      reader.onload = (_event) => {
        this.url = reader.result
      }
    }
  }

  uploadImage(){
      console.log(this.path)
      this.af.upload("/files" + Math.random()+this.path,this.path)
  }


  CreateRecord(){
    console.log(this.path)
    this.af.upload("/files" + Math.random()+this.path,this.path)
    
    let Record = {};
    Record['ProductName'] = this.ProductName;
    Record['ProductDescription'] = this.ProductDescription;
    Record['ProductPrice'] = this.ProductPrice;
    console.log(1);

    this.crudservice.create_NewProduct(Record).then(res => {

      this.ProductName = "";
      this.ProductDescription = "";
      this.ProductPrice = undefined;
      console.log(res);
      this.message = "Product data save Done";

    }).catch(error => {
      console.log(error);
    })


  }
}
