# Daily-Bugle

日常を記録し、気分の浮き沈みを可視化するアプリケーション

## 環境構築

```bash
yarn
# or
npm i
```

## 環境変数

`src/environments`に以下のファイルを追加

- `environment.prod.ts`
- `environment.ts`

以下を記載（中身は適宜変更）  
`environment.prod.ts`

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'API_KEY',
    authDomain: 'AUTH_DOMAIN',
    projectId: 'PROJECT_ID',
    storageBucket: 'STORAGE_BUCKET',
    messagingSenderId: 'MESSAGING_SENDER_ID',
    appId: 'APP_ID',
  },
};
```

`environment.ts`は`production: false`にして同様に記載する

## 起動

```zsh
npm run start
```

## 開発

1. 現在いるブランチの確認
   ```bash
   $ git branch
   * main
   dev
   ```
2. `main`からブランチをきる
   ```bash
   $ git checkout -b label/branch_name
   ```
3. 作業内容をコミット
4. リモートに push
5. PR 作成
6. コードレビュー
7. `main`ブランチにマージ
8. `main`ブランチに移動
   ```bash
   $ git checkout main
   ```
9. タグとリリースノートの作成
   ```bash
   $ npx np --no-publish --yolo
   ```
10. どのバージョンアップなのか選択
11. 完了
