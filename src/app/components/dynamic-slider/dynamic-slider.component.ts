import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { SliderData } from 'src/app/models/sliderData';

@Component({
  selector: 'app-dynamic-slider',
  templateUrl: './dynamic-slider.component.html',
  styleUrls: ['./dynamic-slider.component.scss']
})
export class DynamicSliderComponent {

  constructor() { }
  currentValue : number;
  currentValueString : string;
  maxValue : number;
  minValue: number = 100;
  @Output() outputSum = new EventEmitter<number>();
  labelHeader : string;
  tickvalue: number;
  errorText: string;
  threshold : boolean = true;
  sumText = "Summa";

  @Input() set sliderInputData(sliderData : SliderData){
    this.maxValue = sliderData.maxValue;
    this.minValue = sliderData.minValue;
    this.labelHeader = sliderData.labelHeader;
    this.startValue = sliderData.startValue;
    this.minValue = sliderData.minValue === null ? 0 : sliderData.minValue;
    this.tickvalue = sliderData.tickValue === null ? 1000 : sliderData.tickValue;    
    this.errorText = sliderData.errorText === '' ? '' : sliderData.errorText;

    this.setThreshold();
    this.numberToString();
  }

  setThreshold(){
    if(this.errorText === ''){
      this.threshold = false;
    }
  }

  numberToString(){
    this.currentValueString = this.currentValue.toLocaleString();
  }

  stringToNumber(input : string): number{
    let test = input.replace(/\s/g, "");
    return +test;
  }
  
  @Input() set startValue(value: number){
    this.currentValue = value;
  }
 
  onInputChange(event : MatSliderChange) {
    this.currentValue = event.value;
    this.numberToString();
    this.outputSum.emit(this.currentValue);
  }

  onInputFieldChange(event : any){
    this.currentValue = this.stringToNumber(event);
    this.outputSum.emit(this.currentValue);
  }

}
