import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
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
  pieChart = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  private uid: string;
  private users;
  private bars: any = [];
  private charts: Chart[];
  private achievements;
  private achievementsByOrdinary;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private achievementsService: AchievementsService,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if (!this.achievements || !this.achievements.length) {
      await loading.present();
    }
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

    await this.getAchievementsByDate(this.uid)
      .then(() => {
        console.log('@achievements', this.achievements);
        // TODO: バックエンド側でデータを加工する
        const uniqueOrdinary = {};
        this.achievements.forEach((achievement) => {
          const usersOrdinariesId = achievement.usersOrdinaries.id;
          if (uniqueOrdinary[usersOrdinariesId]) {
            return;
          }

          const result = {
            name: achievement.usersOrdinaries.ordinary.name,
            hasAchieved: this.achievements.filter(
              (ach) => ach.usersOrdinaries.id === usersOrdinariesId && ach.isAchieved,
            ).length,
            count: this.achievements.filter((ach) => ach.usersOrdinaries.id === usersOrdinariesId).length,
          };
          uniqueOrdinary[usersOrdinariesId] = result;
        });
        this.achievementsByOrdinary = Object.values(uniqueOrdinary);
        this.achievementsByOrdinary.forEach((_) => this.pieChart.push({}));
        console.log('@pieChart', this.pieChart);
      })
      .catch((e) => {
        console.error(e);
        throw e;
      })
      .finally(() => {
        loading.dismiss();

        // chartの作成
        this.createRadarChartByWeek();
        this.createPieChart();
        this.createBarChart();
      });
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
    const allAchievementLabels = this.achievementsByOrdinary.map((achievement) => achievement.name);
    const allAchievementData = this.achievementsByOrdinary.map((achievement) => achievement.hasAchieved);
    allAchievementLabels.push('未達成');
    allAchievementData.push(
      this.achievementsByOrdinary.map((achievement) => achievement.count).reduce((sum, len) => sum + len, 0),
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

    console.log('@achievementsByOrd', this.achievementsByOrdinary);
    console.log('@allData', allAchievementData);
    console.log('@allLabel', allAchievementLabels);
  }

  createBarChart() {
    this.charts = this.chartElementRefs.map((chartElementRef, index) => {
      const result = new Chart(chartElementRef.nativeElement, {
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
                this.achievementsByOrdinary[index].hasAchieved,
                this.achievementsByOrdinary[index].count - this.achievementsByOrdinary[index].hasAchieved,
              ],
              borderWidth: 1,
            },
          ],
        },
      });

      return result;
    });
  }
}
