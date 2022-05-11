import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  loading: boolean;
  title: string;
  login: {
    email: string;
    password: string;
    passwordConfirmation: string;
  };

  constructor(public auth: AuthService) {
    this.title = 'アカウント作成';
    this.loading = false;
    this.login = {
      email: null,
      password: null,
      passwordConfirmation: null,
    };
  }

  ngOnInit() {}

  signUp() {
    this.loading = true;
    this.auth.authSignUp(this.login).finally(() => (this.loading = false));
  }
}
