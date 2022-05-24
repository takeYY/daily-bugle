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
  @ViewChild('radarChart') radarChart;
  @ViewChild('allAchievementsPie') allAchievementsPie;
  @ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;

  title = 'ホーム';
  pieChart: any[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  private uid: string;
  private users;
  private bars: any = [];
  private charts: Chart[];
  private achievements;
  private achievementsByOrdinary;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private modalController: ModalController,
    private achievementsService: AchievementsService,
  ) {}

  async ionViewWillEnter(): Promise<void> {
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

    await this.getAchievementsByDate(this.uid);

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

    // chartの作成
    this.createRadarChartByWeek();
    this.createPieChart();
    this.createBarChart();
  }

  async getAchievementsByDate(uid: string) {
    await this.achievementsService
      .findAllByUid(uid)
      .pipe(first())
      .forEach((response) => {
        this.achievements = response;
      });
    return await this.achievements;
  }

  createRadarChartByWeek() {
    this.bars[0] = new Chart(this.radarChart.nativeElement, {
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
        plugins: {
          title: {
            display: true,
            text: '週間毎の達成度（モック）',
            position: 'bottom',
          },
        },
      },
    });
    this.bars[0].canvas.parentNode.style.height = '100%';
    this.bars[0].canvas.parentNode.style.width = '100%';
  }

  createPieChart() {
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
            position: 'bottom',
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
  }

  createBarChart() {
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
  }
}
