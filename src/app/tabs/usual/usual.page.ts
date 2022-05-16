import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  title: string = '日常';
  scene: string = 'everyday';

  dummy_ordinaries;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  constructor(public loadingController: LoadingController, public apiService: ApiService) {}

  async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if (!this.dummy_ordinaries || !this.dummy_ordinaries.length) {
      await loading.present();
    }
    this.apiService.getList(`${environment.apiUrl}/api/ordinaries`).subscribe((response) => {
      console.log(response);
      this.dummy_ordinaries = response;
      loading.dismiss();
    });
  }

  segmentChanged(event: any): void {
    console.log(event);
  }

  toggleReorderGroup(): void {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  doReorder(event: any): void {
    if (this.scene == 'everyday') {
      this.dummy_ordinaries = event.detail.complete(this.dummy_ordinaries);
      return;
    }
    if (this.scene == 'week') {
      this.dummy_ordinaries = event.detail.complete(this.dummy_ordinaries);
      return;
    }
    this.dummy_ordinaries = event.detail.complete(this.dummy_ordinaries);
  }
}
