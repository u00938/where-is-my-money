import dayjs from "dayjs";
import Big from "big.js";

const calculator = {
  expandingRate: (totalBudget, periodStart, periodEnd, curExpand) => {
    const periodDays = dayjs(periodEnd).diff(periodStart, 'd');
    const curPastDays = dayjs().diff(periodStart, 'd') + 1;

    // 하루 권장 지출액
    const dailySpending = new Big(totalBudget).div(periodDays);
    // 오늘까지의 권장 지출액
    const curSpendingRecommended = dailySpending.times(new Big(curPastDays));

    return new Big(curExpand).div(curSpendingRecommended).times(100).toFixed(0).toString();
  }
};

export default calculator;