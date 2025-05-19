/**
 *  @internal
 *  @module Errors
 */

import { APIError, ResponseErrorCode } from "./APIError.js";
import { PathParameterError } from "./PathParameterError.js";
import { RequestParameterError } from "./RequestParameterError.js";
import { RequestError, RequestResponseBaseError, ResponseError } from "./RequestResponseError.js";

export const getProcessingErrorCodeByStatus = (status: number, isThreeDsError?: boolean, message?: string): string => {
    const codeMap: Record<number, string> = {
        301: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.CardNumberNotValid,
        302: ResponseErrorCode.CardExpirationMonthInvalid,
        303: ResponseErrorCode.CardExpirationYearInvalid,
        304: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.CardExpired,
        305: ResponseErrorCode.CardCVVInvalid,
        306: ResponseErrorCode.CardRejected,
        307: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.CardInvalid,
        308: ResponseErrorCode.ChargeInvalidData,
        309: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode[message],
        310: ResponseErrorCode.InvalidUserData,
        311: ResponseErrorCode.TooManyChargeRequests,
        312: ResponseErrorCode.CancelUnavailable,
        313: ResponseErrorCode.ChargeExpired,
        314: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.SeizeCard,
        315: ResponseErrorCode.ContactBank,
        316: ResponseErrorCode.LastNameRequired,
        317: ResponseErrorCode.PartialCaptureNotSupported,
        318: ResponseErrorCode.PartialRefundNotSupported,
        319: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.FraudSuspected,
        320: ResponseErrorCode.BankSystemFailure,
        321: ResponseErrorCode.DynamicDescriptorNotSupported,
        322: ResponseErrorCode.PaymentCodeInvalid,
        323: ResponseErrorCode.PaymentCodeExpired,
        324: ResponseErrorCode.PaymentCodeAlreadyUsed,
        325: ResponseErrorCode.PaymentCodeStillInUse,
        326: ResponseErrorCode.RejectedHighRisk,
        327: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.ConfirmationPeriodExpired,
        328: ResponseErrorCode.RevertFailed,
        329: ResponseErrorCode.RefundFailed,
        330: ResponseErrorCode.PaymentWalletInsufficientFunds,
        331: ResponseErrorCode.InvalidMetadataFieldValue,
        332: ResponseErrorCode.CrossBorderNotAcceptedMissingId,
        333: ResponseErrorCode.CrossBorderNotAcceptedMissingPhoneNumber,
        334: ResponseErrorCode.CrossBorderNotAcceptedUnacceptedPaymentMethod,
        335: ResponseErrorCode.CrossBorderNotAcceptedMissingName,
        336: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.LimitExceededForPaymentType,
        337: ResponseErrorCode.LimitExceededForMerchant,
        338: ResponseErrorCode.TransactionNotFound,
        339: ResponseErrorCode.DuplicateTransaction,
        340: ResponseErrorCode.PaymentWalletRejected,
        341: ResponseErrorCode.InsufficientMerchantInformation,
        342: ResponseErrorCode.CrossBorderNotAcceptedUnacceptedCurrency,
        343: ResponseErrorCode.GatewayServerError,
        344: ResponseErrorCode.PaymentMethodTemporarilyUnavailable,
        345: ResponseErrorCode.PaymentCanceled,
        346: ResponseErrorCode.ExceededPendingThreshold,
        351: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.DisputedTransation,
        355: ResponseErrorCode.PaymentTypeNotSupported,
        356: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.CardNotEnrolledInThreeDS,
        358: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.ThreeDsCouldNotBeCompleted,
        359: isThreeDsError ? ResponseErrorCode.ThreeDsDefaultError : ResponseErrorCode.CardRejected,
        400: ResponseErrorCode.BadRequest,
        401: ResponseErrorCode.NotAuthorized,
        403: ResponseErrorCode.Forbidden,
        404: ResponseErrorCode.NotFound,
        405: ResponseErrorCode.NotAllowed,
        409: ResponseErrorCode.Conflicted,
        429: ResponseErrorCode.TooManyRequests,
        500: ResponseErrorCode.InternalServerError,
        501: ResponseErrorCode.InternalServerError,
        502: ResponseErrorCode.Timeout,
        503: ResponseErrorCode.ServiceUnavailable,
        504: ResponseErrorCode.NoGatewayAvailableToProcessRequest,
    };

    if (Object.keys(codeMap).indexOf(status.toString()) !== -1) {
        return codeMap[status];
    }

    return ResponseErrorCode.UnknownError;
};

export const fromError = (error: Error): RequestResponseBaseError => {
    if (error instanceof PathParameterError || error instanceof RequestParameterError) {
        return new RequestError({
            code: ResponseErrorCode.ValidationError,
            errors: [
                {
                    field: error.parameter,
                    reason: ResponseErrorCode.RequiredValue,
                },
            ],
        });
    } else if (error instanceof APIError) {
        return new ResponseError({
            code: error.response ? error.response.code : getProcessingErrorCodeByStatus(error.status),
            httpCode: error.status,
            errors: error.response ? error.response.errors || error.response : [],
        });
    }

    return new ResponseError({
        code: ResponseErrorCode.UnknownError,
        errors: [],
    });
};
