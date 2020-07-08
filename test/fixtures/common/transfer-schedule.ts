import {
    DayOfWeek,
    TransferPeriod,
    TransferScheduleItem,
    WeekOfMonth,
} from "../../../src/resources/common/TransferSchedule";

export const generateFixture = (): TransferScheduleItem => ({
    waitPeriod: "P3D",
    period: TransferPeriod.MONTHLY,
    dayOfWeek: DayOfWeek.MONDAY,
    weekOfMonth: WeekOfMonth.FIRST,
    dayOfMonth: 1,
    fullPeriodRequired: false,
});
