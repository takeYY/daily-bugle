import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController, ToastController } from '@ionic/angular';

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
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-usual',
  templateUrl: './usual.page.html',
  styleUrls: ['./usual.page.scss'],
})
export class UsualPage {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  title = '日常';
  scenes = [
    { scene: 'today', name: '本日の日常' },
    { scene: 'everyday', name: '毎日' },
    { scene: 'week', name: '週一' },
    { scene: 'weekday', name: '曜日' },
  ];
  scene = this.scenes[0].scene;
  weekdays;
  usersOrdinaries; //constで宣言可能
  achievements: any;
  usersOrdinariesOfToday: any;
  tmp: {
    everyday: [
      {
        name: string;
        startedOn: Date;
      },
    ];
    week: {
      月曜日: [
        {
          name: string;
          startedOn: Date;
        },
        {},
        {},
      ];
      火曜日;
    };
    weekday: [];
  };

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
    private toastController: ToastController,
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
    const now = format(new Date(), 'YYYY-MM-DD');
    const today = new Date(`${now} `);
    const tomorrow = new Date(`${now} `);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ログイン中のユーザが持つ日常の取得
    await this.usersOrdinaryService
      .findAllByUid(this.uid)
      .pipe(first())
      .forEach((response) => {
        this.usersOrdinaries = response;
        this.achievements = [];
        if (!this.usersOrdinaries) {
          //this.achievements = [];
          return;
        }
        this.usersOrdinariesOfToday = this.usersOrdinaries.filter((usersOrdinary) => {
          const startedOn = new Date(usersOrdinary.startedOn._seconds * 1000);
          const weeks = [];
          usersOrdinary.weekdays.forEach((weekday) => {
            weeks.push(weekday.order % 7);
          });
          return startedOn < tomorrow && !usersOrdinary.isClosed && weeks.indexOf(today.getDay()) !== -1;
        });
      })
      .then(() => {
        console.log('@usersOrdinaries', this.usersOrdinaries);
        // 今日分のachievementsを取得
        this.achievementService
          .findAllByDate(this.uid, now)
          .pipe(first())
          .forEach((res) => {
            this.achievements = res;
          })
          .then(() => {
            console.log('@achievements', this.achievements);
            const tmpAchievements = [];
            // 今日分のachievementsがなかったら新たに生成
            if (!this.achievements.length) {
              this.usersOrdinariesOfToday.map((uo) => {
                this.achievementService
                  .postData({
                    userId: this.uid,
                    usersOrdinaries: {
                      ...uo,
                      ordinary: uo.ordinary,
                    },
                    isAchieved: false,
                    createdAt: '',
                    comment: '',
                  })
                  .pipe(first())
                  .forEach((r) => {
                    const weekdayLength = uo.weekdays.length;
                    tmpAchievements.push({
                      ...r,
                      scene: weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday',
                    });
                  });
              });
              this.achievements = tmpAchievements;
            } else {
              for (const achievement of this.achievements) {
                const weekdayLength = achievement.usersOrdinaries.weekdays.length;
                achievement.scene = weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday';
              }
            }
            for (const usersOrdinary of this.usersOrdinaries) {
              const weekdayLength = usersOrdinary.weekdays.length;
              usersOrdinary.scene = weekdayLength === 7 ? 'everyday' : weekdayLength === 1 ? 'week' : 'weekday';
            }
            // weekdaysの取得
            this.weekdayService
              .getList()
              .pipe(first())
              .forEach((response) => {
                //.subscribe((response) => {
                this.weekdays = response;
              })
              .then(() => {
                // 日常の種類ごとにデータを構築
                ['everyday', 'week', 'weekday'].forEach((type) => {
                  this.usersOrdinariesOfToday[type] = this.usersOrdinaries
                    .filter((usersOrdinary) => usersOrdinary.scene === type)
                    .map((usersOrdinary) => {
                      if (type === 'everyday') {
                        return {
                          name: usersOrdinary.ordinary.name,
                          startedOn: new Date(usersOrdinary.startedOn._seconds * 1000),
                        };
                      } else if (type === 'week' || type === 'weekday') {
                        const tmpWeek = {};
                        for (let weekday of this.weekdays) {
                          tmpWeek[weekday.name] = [];
                          const usersOrdinaryWeekName = usersOrdinary.weekdays.map((u) => u.name);
                          const weekdayName = weekday.name;
                          if (usersOrdinaryWeekName.indexOf(weekdayName) !== -1) {
                            const content = {
                              name: usersOrdinary.ordinary.name,
                              startedOn: new Date(usersOrdinary.startedOn._seconds * 1000),
                            };
                            tmpWeek[weekdayName].push(content);
                          } else {
                            tmpWeek[weekdayName].push({});
                          }
                        }

                        return tmpWeek;
                      }
                    });
                });
              });
            console.log('@usersOrdinaries', this.usersOrdinariesOfToday);
          });
      })
      .catch((error) => {
        loading.dismiss();
        console.error(error);
        throw error;
      })
      .finally(() => loading.dismiss());
  }

  segmentChanged(event: any): void {
    //console.log(event);
    console.log(this.scene);
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
        achievements: this.achievements,
        scenes: this.scenes,
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
    this.achievementService
      .updateData(achievement.id, changedAchievement)
      .pipe(first())
      .forEach(() => {})
      .then(async () => {
        const toast = await this.toastController.create({
          message: `「${changedAchievement.usersOrdinaries.ordinary.name}」が達成されました。`,
          duration: 3000,
          position: 'top',
        });
        await toast.present();
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}
