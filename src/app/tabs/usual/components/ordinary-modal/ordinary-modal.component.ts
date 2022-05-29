import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { format } from 'date-fns';
import { UsersOrdinariesService } from 'src/app/api/users-ordinary/users-ordinaries.service';

@Component({
  selector: 'app-ordinary-modal',
  templateUrl: './ordinary-modal.component.html',
  styleUrls: ['./ordinary-modal.component.scss'],
})
export class OrdinaryModalComponent implements OnInit {
  @Input() user;
  @Input() ordinary;
  @Input() now: string;
  @Input() weekdays;
  @Input() usersOrdinary;
  @Input() achievements;
  scenes;

  scene;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private usersOrdinaryService: UsersOrdinariesService,
  ) {}

  ngOnInit() {
    this.usersOrdinary.startedOn = format(this.usersOrdinary.startedOn, 'YYYY-MM-DD');
    this.now = format(this.now, 'YYYY-MM-DD');
    this.scene = this.scenes[0].scene;
    this.scenes = [
      { scene: 'everyday', name: '毎日' },
      { scene: 'weekday', name: '平日' },
      { scene: 'weekend', name: '土日' },
      { scene: 'day', name: '曜日' },
    ];
  }

  async onCreateOrdinary() {
    if (this.scene === 'everyday') {
      this.weekdays = await this.weekdays.map((weekday) => {
        const result = {
          ...weekday,
          isChecked: true,
        };

        return result;
      });
    } else if (this.scene === 'weekday') {
      this.weekdays = await this.weekdays.map((weekday) => {
        const result = {
          ...weekday,
          isChecked: [1, 2, 3, 4, 5].indexOf(weekday.order) !== -1,
        };

        return result;
      });
    } else if (this.scene === 'weekend') {
      this.weekdays = await this.weekdays.map((weekday) => {
        const result = {
          ...weekday,
          isChecked: [6, 7].indexOf(weekday.order) !== -1,
        };

        return result;
      });
    }

    this.achievements = await this.usersOrdinaryService.createUesrsOrdinaries(
      this.user,
      this.ordinary,
      this.weekdays,
      this.usersOrdinary,
      this.achievements,
    );

    this.onModalDismiss(`「${this.ordinary.name}」が作成されました。`);
    return this.achievements;
  }

  onModalDismiss(message?: string): void {
    this.modalController
      .dismiss()
      .then(async () => {
        if (!message) {
          return;
        }

        const toast = await this.toastController.create({
          message,
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
