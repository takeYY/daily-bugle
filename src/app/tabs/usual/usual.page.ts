import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  title: string = '日常';
  scene: string = 'everyday';
  dummy_everyday_contents = ['朝食を摂る', '掃除をする', '髪を整える', '夕飯を作る'];
  dummy_week_contents = ['ベッドシーツを替える', '掃除機をかける'];
  dummy_weekday_contents = ['ゴミ出し', '洗濯'];

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  constructor() {}

  segmentChanged(event: any) {
    console.log(event);
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  doReorder(event: any) {
    if (this.scene == 'everyday') {
      this.dummy_everyday_contents = event.detail.complete(this.dummy_everyday_contents);
    } else if (this.scene == 'week') {
      this.dummy_week_contents = event.detail.complete(this.dummy_week_contents);
    } else {
      this.dummy_weekday_contents = event.detail.complete(this.dummy_weekday_contents);
    }
  }
}
