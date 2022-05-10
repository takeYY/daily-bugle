import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'ホーム', url: '/home', icon: 'home' },
    { title: '設定', url: '/settings', icon: 'settings' },
  ];
  constructor() {}
}
