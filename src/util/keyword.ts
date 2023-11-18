const keyword = {
  consulting_guide: (spendingRate) => {
    if (spendingRate < 80) {
      return `절약을 잘 실천하고 계시네요!🎊 앞으로도 지금처럼만~`;
    } else if (spendingRate >= 80 && spendingRate < 100) {
      return `잘 하고있지만 위험 수준이에요!🚨 조금만 더 절약해봐요!`;
    } else if (spendingRate >= 100) {
      return `절약 실패..😱 하지만 다음달에 다시 도전해봅시다`
    }
  }
}

export default keyword;