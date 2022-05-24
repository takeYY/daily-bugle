import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

import { ProfilePage } from '../../shared/profile/profile.page';
import { UserService } from 'src/app/api/user/user.service';
import { AuthService } from '../../auth/auth.service';

import { IAchievement } from 'src/app/interfaces/achievement/IAchievement';
import { AchievementsService } from 'src/app/api/achievement/achievements.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // TODO: 折れ線グラフ
  //@ViewChild('barChart3') barChart3;
  @ViewChild('barChart4') barChart4;
  @ViewChild('allAchievementsPie') allAchievementsPie;
  @ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;

  title = 'ホーム';
  uid: string;
  bars: any = [];
  charts: Chart[];
  colorArray: any;
  datasets = [
    {
      type: 'pie',
      label: '朝食を摂る',
      labels: ['達成', '未達成'],
      data: [98.2, 1.8],
    },
  ];
  achievements;
  achievementsByOrdinary;

  achievementPie: any[] = [{}, {}, {}, {}, {}];

  private users;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    public modalController: ModalController,
    private achievementsService: AchievementsService,
  ) {}

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
    await this.achievementsService
      .findAllByUid(this.uid)
      .pipe(first())
      .forEach((response) => {
        this.achievements = response;
      });
    console.log('@achievements', this.achievements);
    // TODO: バックエンド側でデータを加工する
    const uniqueOrdinary = this.achievements.map((achievement) => {
      return achievement.usersOrdinaries.ordinary.name;
    });
    this.achievementsByOrdinary = uniqueOrdinary.map((ordinary) => {
      return {
        name: ordinary,
        isAchieved: this.achievements.filter((achievement) => {
          return achievement.usersOrdinaries.ordinary.name === ordinary && achievement.isAchieved;
        }).length,
        achievedLength: this.achievements.filter((achievement) => {
          return achievement.usersOrdinaries.ordinary.name === ordinary;
        }).length,
      };
    });

    console.log('@achievementsByOrdinary', this.achievementsByOrdinary);
    this.createBarChart();
  }

  createBarChart() {
    this.bars[0] = new Chart(this.barChart4.nativeElement, {
      type: 'radar',
      data: {
        labels: ['月', '火', '水', '木', '金', '土', '日'],
        datasets: [
          {
            label: '朝食を摂る',
            data: [100, 89, 75, 90, 45, 25, 30],
            borderWidth: 1,
          },
          {
            label: '歯を磨く',
            data: [100, 100, 100, 100, 100, 95, 97],
            borderWidth: 1,
          },
          {
            label: 'クイックルワイパー',
            data: [90, 95, 85, 75, 70, 90, 95],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
      },
    });
    this.bars[0].canvas.parentNode.style.height = '100%';
    this.bars[0].canvas.parentNode.style.width = '100%';

    const allAchievementLabels = this.achievementsByOrdinary.map((achievement) => {
      return achievement.name;
    });
    const allAchievementData = this.achievementsByOrdinary.map((achievement) => {
      return achievement.isAchieved;
    });
    allAchievementLabels.push('未達成');
    allAchievementData.push(
      this.achievementsByOrdinary
        .map((achievement) => {
          return achievement.achievedLength;
        })
        .reduce((sum, len) => sum + len, 0),
    );
    console.log('@allAchievementLabels', allAchievementLabels);
    console.log('@allAchievementData', allAchievementData);
    this.bars[1] = new Chart(this.allAchievementsPie.nativeElement, {
      type: 'pie',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
        plugins: {
          title: {
            display: true,
            text: '全体の達成度',
          },
        },
      },
      data: {
        labels: allAchievementLabels,
        datasets: [
          {
            label: allAchievementLabels,
            data: allAchievementData,
            borderWidth: 1,
          },
        ],
      },
    });
    this.bars[1].canvas.parentNode.style.height = '100%';
    this.bars[1].canvas.parentNode.style.width = '100%';

    this.charts = this.chartElementRefs.map((chartElementRef, index) => {
      return new Chart(chartElementRef.nativeElement, {
        type: 'pie',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {},
          plugins: {
            title: {
              display: true,
              text: this.achievementsByOrdinary[index].name,
            },
          },
        },
        data: {
          labels: ['達成', '未達成'],
          datasets: [
            {
              label: this.achievementsByOrdinary[index].name,
              data: [
                this.achievementsByOrdinary[index].isAchieved,
                this.achievementsByOrdinary[index].achievedLength - this.achievementsByOrdinary[index].isAchieved,
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    });

    // TODO: 折れ線グラフ
    /* this.bars[0] = new Chart(this.barChart3.nativeElement, {
      type: 'line',
      data: {
        labels: ['5/5', '5/6', '5/7', '5/8', '5/9', '5/10', '5/11'],
        datasets: [
          {
            label: '日移動平均線',
            data: [100, 80, 80, 80, 60, 40, 80],
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: '週移動平均線',
            data: [70, 64, 60, 65, 60, 55, 70],
            borderWidth: 1,
            tension: 0.2,
          },
          {
            label: '月移動平均線',
            data: [77, 82, 85, 81.3333, 80, 77, 80],
            borderWidth: 1,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
      },
    });
    this.bars[0].canvas.parentNode.style.height = '100%';
    this.bars[0].canvas.parentNode.style.width = '100%'; */
  }
}
