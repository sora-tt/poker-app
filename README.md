# POKER APP

## Directory Structure

```
.
└── poker-app/
    ├── backend/
    │   ├── backend/
    │   │   ├── __init__.py
    │   │   ├── asgi.py
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   ├── league/
    │   │   ├── migrations/
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── tests.py
    │   │   ├── urls.py
    │   │   └── views.py
    │   ├── Dockerfile
    │   ├── manage.py
    │   └── requirements.txt
    ├── frontend/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   │   └── title-logo.png
    │   │   ├── components/
    │   │   │   ├── CreateLeague.tsx
    │   │   │   ├── CreateMatch.tsx
    │   │   │   ├── CreatePlayer.tsx
    │   │   │   ├── EditLeague.tsx
    │   │   │   ├── EditMatch.tsx
    │   │   │   ├── EditPlayer.tsx
    │   │   │   ├── Header.tsx
    │   │   │   ├── LeagueDetail.tsx
    │   │   │   ├── Leagues.tsx
    │   │   │   └── MatchList.tsx
    │   │   ├── App.css
    │   │   ├── App.test.tsx
    │   │   ├── App.tsx
    │   │   ├── index.css
    │   │   ├── index.tsx
    │   │   ├── react-app-env.d.ts
    │   │   ├── reportWebVitals.ts
    │   │   └── setupTests.ts
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── README.md
    │   └── tsconfig.json
    ├── .gitignore
    ├── docker-compose.yml
    └── README.md
```

## TODO

- ~~プレイヤー名編集画面の作成~~
- ~~試合作成画面に各リーグの詳細画面から飛べるようにする~~
- ~~！重要：`EditMatch.tsx`でプレイヤー名が表示されない問題の解決~~
  - URL 末尾にスラッシュが必要
  - `http://localhost:8000/api/leagues/${matchData.league}/players/`とすることで解決
- ~~試合作成画面で各プレイヤーの収支を登録できるようにする．(Create Match 押下後の処理を書く)~~
- ~~リーグ詳細画面にプレイヤーの成績をランキング表示する~~
- ~~リーグ詳細画面でプレイヤーの名前を変更できるようにする~~
- `Leagues.tsx` 以外のスタイルを書く
- リリース後
  - 既存のプレイヤーを別のリーグに参加させる機能が必要 → `LeagueDetail.tsx` に専用のボタンを作成する
