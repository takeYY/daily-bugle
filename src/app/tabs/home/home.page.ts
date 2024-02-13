import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ProfilePage } from '../../shared/profile/profile.page';
import { UserService } from 'src/app/api/user/user.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('radarChart') radarChart;
  @ViewChild('allAchievementsPie') allAchievementsPie;
  @ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;

  title = 'ホーム';

  private uid: string;
  private users;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private modalController: ModalController,
  ) {}

  // コンポーネントが表示されるアニメーションがはじまる時に発火
  async ionViewWillEnter(): Promise<void> {
    this.uid = await this.auth.getUserId();

    // user 情報を取得
    // TODO: create_or_get のような関数があれば利用する
    // NOTE: 全ユーザを API で取得した後に filter をかけている...
    this.userService.getList().subscribe(async (response) => {
      this.users = response;
      if (this.users.length) {
        const uids = this.users.filter((user) => user.id === this.uid);
        // UID が一致すればここで終了
        if (uids.length) {
          return;
        }
      }
      const modal = await this.modalController.create({
        component: ProfilePage,
      });
      await modal.present();
    });
  }
}
