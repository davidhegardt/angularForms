import { Component, OnInit } from '@angular/core';
import { UserInformationModel } from 'src/app/models/userInformationModel';
import { FormService } from 'src/app/services/form.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  userInfo : UserInformationModel;
  formFilled = false;
  countries: string[] = [];

  constructor(private formService:FormService, public snackbar: MatSnackBar) { }

  ngOnInit() {
    this.loadCountries();
  }

  userFormOutput(userOutput: UserInformationModel){
    this.userInfo = userOutput;
    console.log(this.userInfo);
    this.formFilled = true;
  }

  loadCountries(){
    this.formService.getJSON().subscribe(x => {
      console.log(x);
      this.countries = x;
    })
  }

  postForm() {
    if(this.formFilled){
      console.log(this.userInfo);
      this.snackbar.open('form submitted success','OK', {
        duration : 2000,
      });
    } else {
      this.snackbar.open('invalid form','OK', {
        duration: 2000,
      });
    }
  }

}
