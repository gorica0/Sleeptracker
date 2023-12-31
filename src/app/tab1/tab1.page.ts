import { Component, ViewChild, ElementRef } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('sleepButton') sleepButton: ElementRef;
  @ViewChild('wakeUpButton') wakeUpButton: ElementRef;

  tempDate: Date = new Date();
  sleepTime: string = new Date(this.tempDate.getTime() - 
  this.tempDate.getTimezoneOffset()*60000).toISOString().slice(0, -1);

  wakeUpTime: string = new Date(this.tempDate.getTime() - 
  this.tempDate.getTimezoneOffset()*60000).toISOString().slice(0, -1);

  submissionSuccess: boolean = false;
  sleepError: boolean = false;
  minDate: string;
  maxDate: string;
  sleepDuration: string = "";


  constructor() {
    // Only allows user to select times between yesterday and today
    const today = new Date(this.tempDate.getTime() - 
  this.tempDate.getTimezoneOffset()*60000);
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 4);

    this.minDate = yesterday.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];

  }

  //Calculates sleep duration and updates sleepDuration string
  calculateSleepDuration() {
    const sleep = new Date(this.sleepTime);
    const wakeUp = new Date(this.wakeUpTime);
    
    // Check if wake up time is next day
    if (wakeUp < sleep) {
      this.sleepError = true;
      return;
    }

    const sleepDiff = wakeUp.getTime() - sleep.getTime();
    const hours = Math.floor(sleepDiff / (1000 * 60 * 60));
    const minutes = Math.floor((sleepDiff % (1000 * 60 * 60)) / (1000 * 60));
    this.sleepError = false;
    this.sleepDuration = `${hours} hours and ${minutes} minutes`;
  }
  gestureOptions($event: any) {
    
    let gesture = $event.getPrediction();
    // console.log('Sleep button:', this.sleepButton); // For debugging
    // console.log('Wake up button:', this.wakeUpButton); // For debugging
    // if (gesture === 'Open Hand') {

    //   this.sleepButton.nativeElement.querySelector('button').click();
    // }
    // if (gesture === 'Closed Hand') {
    //   this.wakeUpButton.nativeElement.querySelector('button').click();
    // }
    if (gesture === 'Two Closed Hands') {
      this.submitButton();
    }
  }
  
  // Logic for when user presses "Submit" button
  async submitButton() {
    console.log(this.sleepTime);
    // Error checking
    this.calculateSleepDuration();
    if (this.sleepError == true) {
      this.submissionSuccess = false;
      return;
    }
    // Stores day of month as key, sleepDuration as value using @Capacitor/preferences
    const wakeUpTimeDate = new Date(this.wakeUpTime);
    const logDate = wakeUpTimeDate.getDate();
    await Preferences.set({
      key: logDate.toString(),
      value: this.sleepDuration
    });
    this.submissionSuccess = true;
    this.sleepError = false;
  }
}
