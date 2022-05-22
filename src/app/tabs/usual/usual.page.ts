import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { format } from 'date-fns';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService, IUser } from '../../shared/firestore.service';

import { IOrdinary } from '../../interfaces/ordinary/IOrdinary';
import { IUsersOrdinary } from '../../interfaces/users-ordinary/IUsersOrdinary';
import { IWeekday } from '../../interfaces/weekday/IWeekday';
import { IAchievement } from 'src/app/interfaces/achievement/IAchievement';

import { UsersOrdinariesService } from '../../api/users-ordinary/users-ordinaries.service';
import { WeekdaysService } from '../../api/weekday/weekdays.service';
import { AchievementsService } from 'src/app/api/achievement/achievements.service';
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
  usersOrdinaries; //constで宣言可能
  achievements: {
    userId: string;
    scene: string;
    isAchieved: boolean;
    comment: string;
    //usersOrdinaries: IUsersOrdinary[];
    usersOrdinaries: any;
  }[];

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
    private usersOrdinaryService: UsersOrdinariesService,
    private achievementService: AchievementsService,
  ) {}

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if (!this.achievements || !this.achievements.length) {
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
      this.achievements = [];
      if (!this.usersOrdinaries) {
        this.achievements = [];
        return;
      }
      // 今日分のachievementsを取得
      /* const now = format(new Date(), 'YYYY-MM-DD');
      console.log('@now', now);
      this.achievementService.findAllByDate(this.uid, now).subscribe((res) => {
        const hasAchievement: any = res;
        const tmpAchievements = [];
        console.log('@hasAchievement', hasAchievement);
        // 今日分のachievementsがなかったら新たに生成
        if (!hasAchievement.length) {
          this.usersOrdinaries.map((uo) => {
            this.achievementService
              .postData({
                userId: this.uid,
                usersOrdinaries: {
                  ...uo,
                  ordinary: uo.ordinary[0],
                },
                isAchieved: false,
                createdAt: '',
                comment: '',
              })
              .subscribe((r) => {
                const weekdayLength = uo.weekdays.length;
                tmpAchievements.push({
                  ...r,
                  scene: weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday',
                });
              });
          });
          this.achievements = tmpAchievements;
        }
      }); */
      //if (!this.achievements.length) {
      this.achievements = this.usersOrdinaries.map((uo) => {
        const weekdayLength = uo.weekdays.length;
        return {
          userId: this.uid,
          usersOrdinaries: {
            ...uo,
            ordinary: uo.ordinary[0],
          },
          scene: weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday',
          comment: '',
          isAchieved: false,
        };
      });
      //}
      console.log('@usersOrdinaries', this.usersOrdinaries);
      console.log('@achievements', this.achievements);
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
      this.achievements
        .filter((ow) => ow.scene === this.scene)
        .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.usersOrdinaries.ordinary) }));
      return;
    }
    if (this.scene === 'week') {
      //this.ordinaries = event.detail.complete(this.ordinaries);
      this.achievements
        .filter((ow) => ow.scene === this.scene)
        .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.usersOrdinaries.ordinary) }));
      return;
    }
    this.achievements
      .filter((ow) => ow.scene === 'weekday')
      .map((ow) => ({ ...ow, ordinary: event.detail.complete(ow.usersOrdinaries.ordinary) }));
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
        //ordinariesWeekday: this.ordinariesWeekday,
        ordinariesWeekday: this.achievements,
      },
    });

    return await modal.present();
  }

  async onAchievedOrdinary($event, achievement: any) {
    $event.preventDefault();
    $event.stopPropagation();

    const changedAchievement: IAchievement = {
      ...achievement,
      isAchieved: !achievement.isAchieved,
    };
    this.achievementService.postData(changedAchievement).subscribe((response) => {
      console.log('@add', response);
    });
  }
}
