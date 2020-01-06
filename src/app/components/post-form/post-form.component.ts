import { Component, OnInit } from '@angular/core';
import { UserInformationModel } from 'src/app/models/userInformationModel';
import { FormService } from 'src/app/services/form.service';
import { MatSnackBar } from '@angular/material';
import { ApartmentFinanceModel } from 'src/app/models/apartmentFinanceModel';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { SliderData } from 'src/app/models/sliderData';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  userInfo : UserInformationModel;
  formFilled = false;
  countries: string[] = [];
  apartmentModel : ApartmentFinanceModel;
  interestMonth: number;
  amorteringMonth: number;
  belaningsGrad : number;
  monthTotalCost : number;
  apartmentPriceSlider : SliderData;
  downpaymentSlider : SliderData;
  interestSlider : SliderData;
  avgiftSlider : SliderData;
  downPaymentError: boolean = false;
  minimumDownPayment : number;

  constructor(private formService:FormService, public snackbar: MatSnackBar) { }

  ngOnInit() {
    this.loadCountries();
    this.initApartmentValues();
  }

  

  userFormOutput(userOutput: UserInformationModel){
    this.userInfo = userOutput;
    this.formFilled = true;
  }

  sliderOutputPrice(currentValue: number){
    this.apartmentModel.apartmentPrice = currentValue;
    this.calcMonthlyCost();
  }

  sliderOutputDownPayment(currentValue: number){
    this.apartmentModel.downPayment = currentValue;
    this.calcMonthlyCost();
  }

  sliderOutputInterest(currentValue: number){
    this.apartmentModel.interestRate = currentValue;
    this.calcMonthlyCost();
  }

  sliderOutputAvgift(currentValue : number){
    this.apartmentModel.avgift = currentValue;
    this.calcMonthlyCost();
  }

  loadCountries(){
    this.formService.getJSON().subscribe(data => {
      this.countries = data;
    })
  }

  initApartmentValues(){
     this.apartmentModel = {
      apartmentPrice : 2850000,
      avgift : 3200,
      downPayment : this.calcDownPayment(2850000),
      interestRate : 1.9
    }

    this.calcMonthlyCost();
    this.initSliderData();
  }

  initSliderData(){
    this.apartmentPriceSlider = {
      labelHeader : 'Pris på boende',
      startValue : this.apartmentModel.apartmentPrice,
      maxValue : this.calcMaxValue(),
      minValue : 10000,
      tickValue : 1000,
      errorText : ''
    }

    this.downpaymentSlider = {
      labelHeader : 'Konantinstats',
      startValue : this.apartmentModel.downPayment,
      maxValue : this.calcMaxValue(),
      minValue : 10000,
      errorText : 'Måste vara minst 15%',
      tickValue : 1000
    }

    this.interestSlider = {
      labelHeader : 'Ränta',
      startValue : this.apartmentModel.interestRate,
      maxValue : 10,
      tickValue : 0.1,
      minValue : 0
    }

    this.avgiftSlider = {
      labelHeader : 'Avgift',
      startValue : this.apartmentModel.avgift,
      maxValue : 10000,
      minValue : 0,
      tickValue : 100
    }
  }

  calcMonthlyCost(){
    let totalDebt = Math.round(this.apartmentModel.apartmentPrice - this.apartmentModel.downPayment);
    
    let interestYear = totalDebt * (this.apartmentModel.interestRate / 100);
    
    this.interestMonth = Math.round(interestYear / 12);
    
    let ranteAvdrag = (interestYear * 0.3) / 12;
    this.interestMonth = Math.round(this.interestMonth - ranteAvdrag);

    this.belaningsGrad = totalDebt / this.apartmentModel.apartmentPrice;
    let amorteringYear;

    if(this.belaningsGrad > 0.85){
      this.downPaymentError = true;
      this.minimumDownPayment = this.calcDownPayment(this.apartmentModel.apartmentPrice);
    } else {
      this.downPaymentError = false;
    }

    if(this.belaningsGrad >= 0.7){
       amorteringYear = totalDebt * 0.02;
    }

    if(this.belaningsGrad < 0.7){
      amorteringYear = totalDebt * 0.01
    }

    if(this.belaningsGrad < 0.5) {
      amorteringYear = 0;
    }

    this.amorteringMonth = Math.round(amorteringYear / 12);
    this.monthTotalCost = this.amorteringMonth + this.apartmentModel.avgift + this.interestMonth;
  }

  calcMaxValue():number {
    return Math.round(this.apartmentModel.apartmentPrice * 4.5);
  }

  calcDownPayment(totalPrice: number):number {
    return Math.round(totalPrice * 0.15);
  }

  postForm() {
    if(this.formFilled){      
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
