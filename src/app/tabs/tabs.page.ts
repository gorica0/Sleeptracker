import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tab1Button') tab1Button: ElementRef;
  @ViewChild('tab2Button') tab2Button: ElementRef;
  @ViewChild('tab3Button') tab3Button: ElementRef;

  constructor() {}

}
