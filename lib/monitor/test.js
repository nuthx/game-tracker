const now = "game2"

export function fakePresence() {
  const state = {
    new: {
      basicPresence: {
        availability: "unavailable",
        primaryPlatformInfo: {
          onlineStatus: "offline"
        }
      }
    },
    offline: {
      basicPresence: {
        availability: "unavailable",
        lastAvailableDate: "2025-04-30T02:11:33.523Z",
        primaryPlatformInfo: {
          onlineStatus: "offline",
          platform: "PS5",
          lastOnlineDate: "2025-04-30T02:11:33.523Z"
        }
      }
    },
    online: {
      basicPresence: {
        availability: "availableToPlay",
        primaryPlatformInfo: {
          onlineStatus: "online",
          platform: "PS5",
          lastOnlineDate: "2025-04-29T15:36:24.580Z"
        }
      }
    },
    game1: {
      basicPresence: {
        availability: "availableToPlay",
        primaryPlatformInfo: {
          onlineStatus: "online",
          platform: "PS5",
          lastOnlineDate: "2025-04-29T15:36:24.580Z"
        },
        gameTitleInfoList: [
          {
            npTitleId: "CUSA01740_00",
            titleName: "God of War™ III Remastered",
            format: "ps4",
            launchPlatform: "PS5",
            npTitleIconUrl: "http://gs2-sec.ww.prod.dl.playstation.net/gs2-sec/appkgo/prod/CUSA01740_00/3/i_e3049ff80f519d044ccc3faa97eec56c3a30dc28be42c43c169d548b92a275d5/i/icon0.png"
          }
        ]
      }
    },
    game2: {
      basicPresence: {
        availability: "availableToPlay",
        primaryPlatformInfo: {
          onlineStatus: "online",
          platform: "PS4",
          lastOnlineDate: "2025-04-29T15:36:24.580Z"
        },
        gameTitleInfoList: [
          {
            npTitleId: "CUSA00000_00",
            titleName: "Urban Myth Dissolution Centerd",
            format: "ps4",
            launchPlatform: "PS4",
            npTitleIconUrl: "https://tinfoil.media/ti/0100B2401D2A8000/800/800"
          }
        ]
      }
    }
  }

  return state[now]
}
