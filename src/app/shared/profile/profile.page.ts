import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import { Camera, CameraResultType } from '@capacitor/camera';

import { FirestoreService, IUser } from '../firestore.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  user: IUser = {
    displayName: null,
    photoDataUrl: 'https://www.seekpng.com/png/detail/385-3852777_ionic-icon-png.png',
  };
  photo: string;

  constructor(public modalController: ModalController, public auth: AuthService, public firestore: FirestoreService) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.uid = await this.auth.getUserId();
    const user = await this.firestore.userInit(this.uid);
    if (user) {
      this.user = user;
    }
  }

  async updateProfile() {
    if (this.photo) {
      this.user.photoDataUrl = this.photo;
    }
    await this.firestore.userSet(this.user);
    this.modalController.dismiss();
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  // TODO: 写真を任意に登録できるようにする
  /* async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
    });

    this.photo = image && image.dataUrl;
  } */
}
