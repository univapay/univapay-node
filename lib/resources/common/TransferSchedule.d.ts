/**
 *  @internal
 *  @module Configuration
 */
export declare enum TransferPeriod {
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    SEMIMONTHLY = "semimonthly",
    MONTHLY = "monthly"
}
export declare enum DayOfWeek {
    SUNDAY = "sunday",
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday"
}
export declare enum WeekOfMonth {
    FIRST = "first",
    SECOND = "second",
    THIRD = "third",
    FOURTH = "fourth",
    LAST = "last"
}
export interface TransferScheduleItem {
    waitPeriod: string;
    period: TransferPeriod;
    fullPeriodRequired: boolean;
    dayOfWeek: DayOfWeek;
    weekOfMonth: WeekOfMonth;
    dayOfMonth: number;
    weeklyClosingDay?: DayOfWeek;
    weeklyPayoutDay?: DayOfWeek;
}
