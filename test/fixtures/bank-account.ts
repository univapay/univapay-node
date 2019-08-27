import uuid from 'uuid';
import { BankAccountItem, BankAccountStatus, BankAccountType } from '../../src/resources/BankAccounts';

export function generateFixture(): BankAccountItem {
    return {
        id: uuid(),
        holderName: 'Joe Doe',
        bankName: 'Bank',
        branchName: 'Branch',
        country: 'JP',
        bankAddress: 'Address',
        currency: 'JPY',
        swiftCode: 'FAKECODE',
        lastFour: '7890',
        status: BankAccountStatus.VERIFIED,
        primary: true,
        accountNumber: '1234567890',
        accountType: BankAccountType.CHECKING,
        createdOn: new Date().toISOString(),
    };
}
