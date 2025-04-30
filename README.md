<h1 align="center">ゲーム時計</h1>

<p align="center">
  <br />
  <p align="center">Track and record your PSN gaming time</p>
  <p align="center">
    English |
    <a href="./README.zh.md">中文</a>
  </p>
  <br />
</p>

## 📖 Introduction

ゲーム時計 is designed to track and record your PlayStation Network gaming time.

With third-party API support, the application automatically retrieves current game status and playtime, presenting them in chart form.

## ✨ Features

- Automatic PSN gaming time recording
- Visual representation of gaming time and statistics (developing)
- Support for exporting game records in JSON format
- Quick deployment to Docker or Vercel

## 🚀 Deployment

(To be added)

## 🎮 Usage

### 1. Obtaining NPSSO

Visit [PlayStation](https://www.playstation.com/) in your browser, click the "Login" button, and sign in with your PSN account.

Open [https://ca.account.sony.com/api/v1/ssocookie](https://ca.account.sony.com/api/v1/ssocookie) in a new tab. The browser will return a JSON response in the following format:

```
{ "npsso": "<64 character token>" }
```

The 64-character string is your NPSSO.

### 2. Adding an Account

Log in to the system using the default account `admin` with password `admin`. The login status will be saved in local cookies for 30 days.

Add your NPSSO in the settings and save it. The system will automatically update your user profile and display your avatar and ID information on the right.

### 3. Tracking Game Records

By default, the system tracks your own gaming time. If you want to track another user's gaming time, enter their Account ID in the PSN account field in the settings.

To reduce resource consumption, you can also adjust to a longer refresh interval (default is 1 minute).

## 📝 Contributions and Feedback

Pull Requests are welcome. Please ensure you follow the project's coding and submission standards.

To request additional features, please submit an Issue, and they will be considered for addition.

If you encounter any errors, please describe the problem in detail in the Issues section to help reproduce and resolve the issue.

## 🙏 Acknowledgements

- [psn-api](https://github.com/achievements-app/psn-api) - Provides third-party PlayStation Network API support

## ⚠️ Disclaimer

This project's code is for learning and exchange purposes only and should not be used for commercial purposes.
