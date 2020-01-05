import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserInformationModel } from 'src/app/models/userInformationModel';

@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.scss']
})
export class ValidationFormComponent implements OnInit {

  userForm: FormGroup = {} as FormGroup;
  userInformation : UserInformationModel = {} as UserInformationModel;
  streetAddress : string;
  zipCode : string;
  city : string;
  numericPattern = '^[0-9]*$';

  @Input() countries : string[];
  @Output() userPostModel = new EventEmitter<UserInformationModel>();

  get streetValidation() {
    return this.userForm.get('street');
  }

  get zipCodeValidation() {
    return this.userForm.get('zipCode');
  }

  get firstNameValidation() {
    return this.userForm.get('firstName');
  }

  get lastNameValidation() {
    return this.userForm.get('lastName');
  }

  get cityValidation() {
    return this.userForm.get('city');
  }

  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.initFormControl();
  }

  initFormControl() {
    this.userForm = this.formBuilder.group({
      firstName : new FormControl('', [
        Validators.required
      ]),      
      lastName : new FormControl('', [
        Validators.required
      ]),
      street: new FormControl('', [
        Validators.required
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.numericPattern)
      ]),
      city: new FormControl('', [
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.required
      ])
    })

    this.subscripeToValueChanges();
  }

  subscripeToValueChanges(){
     this.userForm.valueChanges.subscribe(form => {       
       if(this.userForm.valid){
          const {street, zipCode, city, firstName, lastName, country} = form;          

          this.userInformation = {
            address : {
              city : city,
              street : street,
              zipcode : zipCode
            },
            firstName : firstName,
            lastName : lastName,
            country : country
          };
          
          this.userPostModel.emit(this.userInformation);
       }
     })
   }

   postForm(){
     if(this.userForm.valid){
     }
   }

}
