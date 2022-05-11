export const firebaseError = {
  'auth/invalid-email': {
    code: 'メールアドレスの間違い',
    message: 'メールアドレスのフォーマットが間違っています。',
  },
  'auth/wrong-password': {
    code: 'パスワードの間違い',
    message: 'パスワードが間違っています。',
  },
  'auth/mismatch-password-confirmation': {
    code: 'パスワードの不一致',
    message: '確認用パスワードと一致しません。',
  },
  'auth/weak-password': {
    code: '脆弱性があります',
    message: 'パスワードは最低でも6文字以上のものをご利用ください。',
  },
  'auth/user-not-found': {
    code: 'ユーザーが見つかりません',
    message: 'ユーザは存在しません。',
  },
  'auth/email-already-in-use': {
    code: 'ユーザーが存在しています',
    message: 'ユーザが既に作成されています。',
  },
};
