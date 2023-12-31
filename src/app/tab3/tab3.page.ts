import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  currentSegment: string = "overnight";
  overnightLogs: any[] = [];
  daytimeLogs: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadData();
  }
  handleGesture($event: any) {
    let gesture = $event.getPrediction();
    if (gesture === 'Two Open Hands') {
      this.loadData();
    }
    if (gesture === 'Two Hands Pinching') {
      this.deleteAllLogs();
    }
  }

  async deleteAllLogs() {
    await Preferences.clear();
    this.overnightLogs = [];
    this.daytimeLogs = [];
  }
  
  async deleteNightLog(log: any) {
    console.log("deletecard")
    let tempDate = log.date.getDate();

    await Preferences.remove({key: tempDate.toString()});

  }

  async deleteDayLog(log: any) {
    const existingRatingLogs = await Preferences.get({key: 'daytimeSleepyRating'});
    this.daytimeLogs = existingRatingLogs.value ? JSON.parse(existingRatingLogs.value) : [];

    this.daytimeLogs = this.daytimeLogs.filter(rating =>
      rating.sleepinessLevel !== log.sleepinessLevel ||
      rating.dateTime !== log.dateTime
    );
    this.daytimeLogs.reverse();
    await Preferences.set({
      key: 'daytimeSleepyRating',
      value: JSON.stringify(this.daytimeLogs)
    });

  }

  async loadData() {
    // Clear previous data
    this.overnightLogs = [];
    this.daytimeLogs = [];

    // for Date calculations
    const today = new Date();
    let logDate = today.getDate();
    let logMonth = today.getMonth();
    let logYear = today.getFullYear();

    //load sleep logs from past week 
    for (let i = 0; i < 7; i++) {
      const overnightData = await Preferences.get({ key: logDate.toString() });
      console.log(logDate);
      if (overnightData.value) {
        const fullDate = new Date(logYear, logMonth, logDate)
        this.overnightLogs.push({date: fullDate, sleepDuration: overnightData.value});
      }

      // decrement logDate logic
      if (logDate == 1) {
        const prevMonth = logMonth - 1;
        if(prevMonth == 0 || prevMonth == 2 || prevMonth == 4 || prevMonth == 6 || prevMonth == 7 || prevMonth == 9) {
          logDate = 31;
          logMonth--;
        }
        else if (prevMonth == 3 || prevMonth == 5 || prevMonth == 8 || prevMonth == 10) {
          logDate = 30;
          logMonth--;
        }
        else if (prevMonth == -1) {
          logDate = 31;
          logYear--;
          logMonth = 11;
        }
        else {
          logDate = 28;
          logMonth--;
        }
      }
      else {
        logDate--;
      }
    }
    // load daytime logs
    const existingRatingLogs = await Preferences.get({key: 'daytimeSleepyRating'});
    this.daytimeLogs = existingRatingLogs.value ? JSON.parse(existingRatingLogs.value) : [];
    this.daytimeLogs.reverse();
  }
  
}