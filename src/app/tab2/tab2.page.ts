import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  sleepinessLevel: number = 1;
  dateTime: string = new Date().toISOString();
  minDate: string;
  maxDate: string;
  submissionDone: boolean = false;
  daytimeError: boolean = false;
  isModalOpen = false;

  // Limits user date selection to past week only
  constructor() {
    const today = new Date();
    const lastWeek = new Date(today);

    lastWeek.setDate(lastWeek.getDate() - 7);

    this.minDate = lastWeek.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];

  }
  handleGesture($event: any) {
    let gesture = $event.getPrediction();
    const step = 1; 
    const minValue = 1;
    const maxValue = 7;

    if (gesture === 'Hand Pointing and Open' && this.sleepinessLevel < maxValue) {
      this.sleepinessLevel += step;
    } else if (gesture === 'Hand Pointing and Closed' && this.sleepinessLevel > minValue) {
      this.sleepinessLevel -= step;
    }
    if (gesture === 'Two Hands Pointing') {
      this.submitRating();
    }
    if (gesture === 'Open Hand') {
      this.setOpen(true);
    }
    if (gesture === 'Closed Hand') {
      this.setOpen(false);
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // Submit button logic
  async submitRating() {
    if (this.sleepinessLevel <= 0) {
      this.daytimeError = true;
      this.submissionDone = false;
      return;
    }
    // stores sleepiness and time recorded in an array
    const sleepRatingData = {
      sleepinessLevel: this.sleepinessLevel,
      dateTime: this.dateTime
    };
    // Checks current recorded values
    const existingRatingLogs = await Preferences.get({key: 'daytimeSleepyRating'});

    let ratingLogsArray = existingRatingLogs.value ? JSON.parse(existingRatingLogs.value) : [];

    if (!Array.isArray(ratingLogsArray)) {
      ratingLogsArray = [];
    }
    // Adds current sleepiness data to the array
    ratingLogsArray.push(sleepRatingData);

    // stores the array in local storage
    await Preferences.set({
      key: 'daytimeSleepyRating',
      value: JSON.stringify(ratingLogsArray)
    });
    this.submissionDone = true;
    this.daytimeError = false;
  }
}
