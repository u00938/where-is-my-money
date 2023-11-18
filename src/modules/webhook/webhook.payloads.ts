const payloads = {
  consulting_guide: (data, leftDays) => {
    return {
      "username": "💸WHERE IS MY MONEY?!🤯",
      "avatar_url": "https://i.imgur.com/AcRV2KW.jpg",
      "content": "오늘은 얼마나 쓰면 되는지 알려드릴게요🫠🚀",
      "embeds": [
        {
          "author": {
            "name": "Your Wallet♫",
            "icon_url": "https://i.imgur.com/vWy6gVI.jpg"
          },
          "title": "오늘의 지출 추천",
          "description": "남은 예산으로 계산한 결과~~",
          "color": 15258703,
          "image": {
            "url": "https://i.imgur.com/2MG51QU.jpg"
          },
          "fields": data,
          "footer": {
            "text": `돈은 통장을 스쳐갈 뿐,, ${leftDays}일만 더 버팁시다`,
            "icon_url": "https://i.imgur.com/QWQB9Yp.jpg"
          }
        }
      ]
    }
  },

  consulting_guide_msgFormat: (leftAmount, dailyMaxSpend, categoryBudget, msg) => {
    return [
      {
        "name": `🔔남은 예산: **${leftAmount}원**`,
        "value": `오늘부터 하루 **${dailyMaxSpend}원** 쓰셔야 지갑을 지킬 수 있어요🫡`
      },
      {
        "name": `💡카테고리별로 알려드릴게요`,
        "value": categoryBudget
      },
      {
        "name": `💝절약 현황`,
        "value": `💌${msg}`
      }
    ]
  },

  consulting_notify: (data, spendToday, leftDays) => {
    return {
      "username": "💸WHERE IS MY MONEY?!🤯",
      "avatar_url": "https://i.imgur.com/AcRV2KW.jpg",
      "content": "🎈오늘은 얼마나 썼는지 알려드릴게요",
      "embeds": [
        {
          "author": {
            "name": "Your Wallet♫",
            "icon_url": "https://i.imgur.com/vWy6gVI.jpg"
          },
          "title": "오늘의 지출 총정리",
          "description": `총 ${spendToday}원 쓰셨네요!😎`,
          "color": 10022399,
          "image": {
            "url": "https://i.imgur.com/FSTKnw9.jpg"
          },
          "fields": data,
          "footer": {
            "text": `돈은 통장을 스쳐갈 뿐,, ${leftDays}일만 더 버팁시다`,
            "icon_url": "https://i.imgur.com/QWQB9Yp.jpg"
          }
        }
      ]
    }
  },

  consulting_notify_msgFormat: (leftAmount, dailyMaxSpend, spendToday, spendingRate, spendCategoryToday) => {
    return [
      {
        "name": `🔔남은 예산: **${leftAmount}원**`,
        "value": `오늘 하루 예산 **${dailyMaxSpend}원** 중 **${spendToday}원** 쓰셨네요! \n 현재 예산 소비율: **${spendingRate}%**`,
        "inline": true
      },
      {
        "name": `💡카테고리별 지출은?`,
        "value": spendCategoryToday
      }
    ]
  }

}

export default payloads
