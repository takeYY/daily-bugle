import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup, IonRouterOutlet } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService, IUser } from '../../shared/firestore.service';

export interface Ordinary {
  name: string;
}

export class UsersOrdinary {
  userId: string;
  ordinaryId: string;
  weekdayId: string;
  startedOn: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  private uid: string; //userID
  private user: IUser; // User
  private ordinary: Ordinary; //日常
  private usersOrdinary: UsersOrdinary; //ユーザごとの日常
  ordinaryName: string = ''; //日常名
  //selectedWeekdays: [] = [];
  title: string = '日常';
  scene: string = 'everyday';
  now = new Date();

  weekdays;
  dummy_ordinaries;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  constructor(
    public loadingController: LoadingController,
    public apiService: ApiService,
    public routerOutlet: IonRouterOutlet,
    private auth: AuthService,
    private firestore: FirestoreService,
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
    this.apiService.getList(`${environment.apiUrl}/api/ordinaries`).subscribe((response) => {
      console.log(response);
      this.dummy_ordinaries = response;
      loading.dismiss();
    });
    this.uid = await this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
    this.apiService.getList(`${environment.apiUrl}/api/weekdays`).subscribe((response) => {
      this.weekdays = response;
      console.log(this.weekdays);
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

  async createOrdinary(): Promise<void> {
    if (!this.user) {
      alert('ログインが必要です！');
      return;
    }

    if (!this.ordinaryName) {
      alert('日常名がありません！');
      console.log(this.ordinaryName);
      return;
    }
    if (!this.weekdays) {
      alert('曜日が選択されていません！');
      //return;
    }
    console.info(this.weekdays);
    console.info(this.uid);
    // 日常の雛形作成
    this.ordinary = {
      name: this.ordinaryName,
    };
    // 日常の登録
    this.apiService
      .postData(`${environment.apiUrl}/api/ordinaries`, this.ordinary)
      .subscribe((response: ArrayBuffer) => {
        // 日常のダミーデータ更新
        this.dummy_ordinaries.push({
          id: response['id'],
          name: response['name'],
        });
        // 日常の入力項目初期化
        this.ordinaryName = '';
        // 登録する曜日毎にusers-ordinaries登録
        this.weekdays.forEach((weekday) => {
          if (!weekday.isChecked) {
            console.error(weekday);
            return;
          }

          // 曜日毎に日常を登録する雛形作成
          this.usersOrdinary = {
            userId: this.uid,
            ordinaryId: response['id'],
            weekdayId: weekday.id,
            startedOn: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          // ユーザ毎の日常登録
          this.apiService
            .postData(`${environment.apiUrl}/api/users-ordinaries`, this.usersOrdinary)
            .subscribe((res) => {
              console.info(res);
            });
        });
      });
  }
}
