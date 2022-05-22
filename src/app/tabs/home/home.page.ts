import { Component, OnInit } from '@angular/core';
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
  title = 'ホーム';
  uid: string;
  private users;
  constructor(private auth: AuthService, private userService: UserService, public modalController: ModalController) {}

  async ionViewDidEnter(): Promise<void> {
    this.uid = await this.auth.getUserId();
    this.userService.getList().subscribe(async (response) => {
      this.users = response;
      if (this.users.length) {
        const uids = this.users.filter((user) => user.id === this.uid);
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
