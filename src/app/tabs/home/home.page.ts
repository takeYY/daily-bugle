import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('barChart') barChart;
  @ViewChild('barChart2') barChart2;
  @ViewChild('barChart3') barChart3;
  @ViewChild('barChart4') barChart4;

  title: string = 'ホーム';
  bars: any = [];
  colorArray: any;

  datasets = [
    {
      type: 'pie',
      label: '朝食を摂る',
      labels: ['達成', '未達成'],
      data: [98.2, 1.8],
    },
  ];

  ionViewDidEnter() {
    this.createBarChart();
  }

  constructor() {}

  createBarChart() {
    this.bars[0] = new Chart(this.barChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['達成', '未達成'],
        datasets: [
          {
            label: '朝食を摂る',
            data: [89.1, 10.9],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {},
        plugins: {
          title: {
            display: true,
            text: '朝食を摂る',
          },
        },
      },
    });
    this.bars[0].canvas.parentNode.style.height = '200px';
    this.bars[0].canvas.parentNode.style.width = '200px';

    this.bars[1] = new Chart(this.barChart2.nativeElement, {
      type: 'pie',
      data: {
        labels: ['達成', '未達成'],
        datasets: [
          {
            label: '掃除をする',
            data: [76.5, 23.5],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {},
      },
    });
    this.bars[1].canvas.parentNode.style.height = '200px';
    this.bars[1].canvas.parentNode.style.width = '200px';

    this.bars[2] = new Chart(this.barChart3.nativeElement, {
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
    this.bars[2].canvas.parentNode.style.height = '100%';
    this.bars[2].canvas.parentNode.style.width = '100%';

    this.bars[3] = new Chart(this.barChart4.nativeElement, {
      type: 'radar',
      data: {
        labels: ['月', '火', '水', '木', '金', '土', '日'],
        datasets: [
          {
            label: '朝食を摂る',
            data: [100, 89, 75, 90, 45, 25, 30],
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
    this.bars[3].canvas.parentNode.style.height = '100%';
    this.bars[3].canvas.parentNode.style.width = '100%';
  }
}
