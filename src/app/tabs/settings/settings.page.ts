import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  title: string;
  contents: {
    label: string;
    icon: string;
    action: string;
  }[];

  constructor(public auth: AuthService, public modalController: ModalController) {
    this.title = '設定';
    this.contents = [
      { label: 'プロフィール', icon: 'person', action: 'openProfile' },
      { label: 'ログアウト', icon: 'log-out', action: 'signOut' },
    ];
  }

  action_router(action_type: string) {
    switch (action_type) {
      case 'signOut':
        return this.signOut();
      default:
        break;
    }
  }

  signOut() {
    this.auth.authSignOut();
  }
}
