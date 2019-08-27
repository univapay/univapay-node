import {
    TransferScheduleItem,
    TransferPeriod,
    DayOfWeek,
    WeekOfMonth,
} from '../../../src/resources/common/TransferSchedule';

export function generateFixture(): TransferScheduleItem {
    return {
        waitPeriod: 'P3D',
        period: TransferPeriod.MONTHLY,
        dayOfWeek: DayOfWeek.MONDAY,
        weekOfMonth: WeekOfMonth.FIRST,
        dayOfMonth: 1,
        fullPeriodRequired: false,
    };
}
