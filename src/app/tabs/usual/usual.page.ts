import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService, IUser } from '../../shared/firestore.service';

import { IOrdinary } from '../../interfaces/ordinary/IOrdinary';
import { IUsersOrdinary } from '../../interfaces/users-ordinary/IUsersOrdinary';
import { IWeekday } from '../../interfaces/weekday/IWeekday';

import { UsrsOrdinariesService } from '../../api/users-ordinary/usrs-ordinaries.service';
import { WeekdaysService } from '../../api/weekday/weekdays.service';
import { OrdinaryModalComponent } from './components/ordinary-modal/ordinary-modal.component';

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  title = '日常';
  scene = 'everyday';
  weekdays;
  usersOrdinaries;
  ordinariesWeekday: { ordinary: IOrdinary; weekdays: IWeekday[]; scene: string }[];

  private uid: string; //userID
  private user: IUser; // User
  private ordinary: IOrdinary = { name: null }; //日常
  private usersOrdinary: IUsersOrdinary = {
    userId: null,
    ordinary: null,
    weekdays: [],
    startedOn: null,
    createdAt: null,
    updatedAt: null,
    isClosed: false,
  }; //ユーザごとの日常

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private auth: AuthService,
    private firestore: FirestoreService,
    private weekdayService: WeekdaysService,
    private usersOrdinaryService: UsrsOrdinariesService,
  ) {}

  /* async ngOnInit(): Promise<void> {
    const user = await this.firestore.userInit(await this.auth.getUserId());
    if (!user) {
      console.error('userがいません！');
    }
  } */

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if (!this.ordinariesWeekday || !this.ordinariesWeekday.length) {
      await loading.present();
    }
    this.uid = await this.auth.getUserId();
    this.usersOrdinary.userId = this.uid;
    this.user = await this.firestore.userInit(this.uid);
    // weekdaysの取得
    this.weekdayService.getList().subscribe((response) => {
      this.weekdays = response;
    });

    // ログイン中のユーザが持つ日常の取得
    this.usersOrdinaryService.findAllByUid(this.uid).subscribe((response) => {
      this.usersOrdinaries = response;
      loading.dismiss();
      if (!this.usersOrdinaries) {
        this.ordinariesWeekday = [];
        return;
      }
      this.ordinariesWeekday = this.usersOrdinaries.map((uo) => {
        const weekdayLength = uo.weekdays.length;
        return {
          ordinary: uo.ordinary[0],
          weekdays: uo.weekdays,
          scene: weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday',
        };
      });
    });
  }

  segmentChanged(event: any): void {
    console.log(event);
  }

  toggleReorderGroup(): void {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  doReorder(event: any): void {
    if (this.scene === 'everyday') {
      //this.ordinariesWeekday.ordinary = event.detail.complete(this.ordinaries);
      this.ordinariesWeekday
        .filter((ow) => ow.scene === this.scene)
        .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.ordinary) }));
      return;
    }
    if (this.scene === 'week') {
      //this.ordinaries = event.detail.complete(this.ordinaries);
      this.ordinariesWeekday
        .filter((ow) => ow.scene === this.scene)
        .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.ordinary) }));
      return;
    }
    this.ordinariesWeekday
      .filter((ow) => ow.scene === 'weekday')
      .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.ordinary) }));
    return;
  }

  async editOrdinary(): Promise<void> {
    // TODO: 記載する
    console.log('@@@@編集ボタン押下！！');
  }

  async onCreateOrdinaryModal($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.usersOrdinary.startedOn = new Date();

    const modal = await this.modalController.create({
      component: OrdinaryModalComponent,
      swipeToClose: true,
      canDismiss: true,
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        user: this.user,
        ordinary: this.ordinary,
        now: new Date(),
        weekdays: this.weekdays,
        usersOrdinary: this.usersOrdinary,
        ordinariesWeekday: this.ordinariesWeekday,
      },
    });

    return await modal.present();
  }
}
