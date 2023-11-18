import dayjs from "dayjs";
import Big from "big.js";

const calculator = {
  spendingRate: (totalBudget, periodStart, periodEnd, curSpend) => {
    const periodDays = dayjs(periodEnd).diff(periodStart, 'd');
    const curPastDays = dayjs().diff(periodStart, 'd') + 1;

    // 하루 권장 지출액
    const dailySpending = new Big(totalBudget).div(periodDays);
    // 오늘까지의 권장 지출액
    const curSpendingRecommended = dailySpending.times(new Big(curPastDays));

    return new Big(curSpend).div(curSpendingRecommended).times(100).toFixed(0).toString();
  },

  dailyMaxSpendAmount: (totalBudget, leftDays, curSpend) => {
    // 남은 일자, 남은 금액 고려
    // 항상 다른 값
    const leftAmount = new Big(totalBudget).minus(new Big(curSpend));

    // 남은 금액이 없을 경우 최소 금액 값으로 리턴
    if (leftAmount.cmp(0) === -1) {
      return '10';
    }

    const dailySpend = new Big(leftAmount).div(leftDays);

    // 100원 단위 반올림
    return dailySpend.round(-2, Big.roundHalfUp).toString();
  }
};

export default calculator;