import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  loading = false;
  login: {
    email: string;
    password: string;
  } = {
    email: null,
    password: null,
  };

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  signIn() {
    this.loading = true;
    this.auth.authSignIn(this.login).finally(() => (this.loading = false));
  }
}
