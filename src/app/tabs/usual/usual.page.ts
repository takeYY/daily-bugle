import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService, IUser } from '../../shared/firestore.service';

import { IOrdinary } from '../../interfaces/ordinary/IOrdinary';
import { IUsersOrdinary } from '../../interfaces/users-ordinary/IUsersOrdinary';

import { OrdinariesService } from '../../api/ordinary/ordinaries.service';
import { UsrsOrdinariesService } from '../../api/users-ordinary/usrs-ordinaries.service';
import { WeekdaysService } from '../../api/weekday/weekdays.service';
import { IWeekday } from 'src/app/interfaces/weekday/IWeekday';

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  private uid: string; //userID
  private user: IUser; // User
  ordinary: IOrdinary = { name: null }; //日常
  usersOrdinary: IUsersOrdinary = {
    userId: null,
    ordinaryId: null,
    weekdayId: null,
    startedOn: null,
    createdAt: null,
    updatedAt: null,
  }; //ユーザごとの日常
  title: string = '日常';
  scene: string = 'everyday';
  now = new Date();

  weekdays;
  dummy_ordinaries;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  constructor(
    private loadingController: LoadingController,
    private auth: AuthService,
    private firestore: FirestoreService,
    private ordinaryService: OrdinariesService,
    private weekdayService: WeekdaysService,
    private usersOrdinaryService: UsrsOrdinariesService,
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.firestore.userInit(await this.auth.getUserId());
    if (!user) {
      console.error('userがいません！');
    }
    /* this.apiService.getList(`${environment.apiUrl}/api/users`).subscribe((response) => {
      users = response;
    }); */
  }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if (!this.dummy_ordinaries || !this.dummy_ordinaries.length) {
      await loading.present();
    }
    console.log(this.ordinaryService.basePath);
    console.log(this.weekdayService.basePath);
    this.ordinaryService.getList().subscribe((response) => {
      this.dummy_ordinaries = response;
      loading.dismiss();
    });
    this.uid = await this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
    this.weekdayService.getList().subscribe((response) => {
      this.weekdays = response;
    });
    this.usersOrdinary.userId = this.uid;
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

  async createOrdinary(): Promise<void> {
    if (!this.user) {
      alert('ログインが必要です！');
      return;
    }

    if (!this.ordinary.name) {
      alert('日常名がありません！');
      return;
    }
    if (!this.weekdays) {
      alert('曜日が選択されていません！');
      //return;
    }
    // 日常の登録
    this.ordinaryService.postData(this.ordinary).subscribe((response: ArrayBuffer) => {
      // 日常のダミーデータ更新
      this.dummy_ordinaries.push({
        id: response['id'],
        name: response['name'],
      });
      // 日常の入力項目初期化
      this.ordinary.name = '';
      // 登録する曜日毎にusers-ordinaries登録
      this.weekdays.forEach((weekday) => {
        if (!weekday.isChecked) {
          return;
        }

        // 曜日毎に日常を登録する雛形作成
        this.usersOrdinary.ordinaryId = response['id'];
        this.usersOrdinary.weekdayId = weekday.id;
        this.usersOrdinary.createdAt = new Date();
        // ユーザ毎の日常登録
        this.usersOrdinaryService.postData(this.usersOrdinary).subscribe((res) => {
          console.info(res);
        });
      });
    });
  }
}
