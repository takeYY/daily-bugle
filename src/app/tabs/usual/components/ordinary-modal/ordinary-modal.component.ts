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

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private usersOrdinaryService: UsersOrdinariesService,
  ) {}

  ngOnInit() {
    this.usersOrdinary.startedOn = format(this.usersOrdinary.startedOn, 'YYYY-MM-DD');
    this.now = format(this.now, 'YYYY-MM-DD');
  }

  async onCreateOrdinary() {
    this.achievements = await this.usersOrdinaryService.createUesrsOrdinaries(
      this.user,
      this.ordinary,
      this.weekdays,
      this.usersOrdinary,
      this.achievements,
    );

    console.log('@achievements', this.achievements);

    this.onModalDismiss(`「${this.ordinary.name}」が作成されました。`);
    return this.achievements;
  }

  onModalDismiss(message: string): void {
    this.modalController
      .dismiss()
      .then(async () => {
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
