import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  tabs = [
    { path: 'home', name: 'ホーム', icon: 'home' },
    { path: 'usual', name: '日常', icon: 'list' },
    { path: 'settings', name: '設定', icon: 'settings' },
  ];

  constructor() {}

  ngOnInit() {}
}
