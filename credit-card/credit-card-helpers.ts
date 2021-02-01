import * as angular from "angular";
import {
    ICreditCardHelpers,
    IAuthRequestConfig,
    IAuthObject,
    ITokenVerificationResponse,
    IAuthResponse,
} from "./credit-card.interface";

export class CreditCardHelpers implements ICreditCardHelpers {
    static $inject = ["$rootScope"];

    constructor(private readonly $rootScope: angular.IRootScopeService) {}

    createAuthRequest(object: IAuthRequestConfig): IAuthObject {
        const {
            creditCardConfig,
            savedTokenizeResponse,
            is3DS = false,
            threeDSecure = null,
        } = object;

        const {
            total,
            currencyCode,
            billingAddress: {
                city: billingCity,
                country: billingCountry,
                postCode: billingPostCode,
                street: billingStreet,
                region: billingRegion,
                customerName: billingCustomerName,
            },
            deliveryAddress: {
                city: shippingCity,
                country: shippingCountry,
                postCode: shippingPostCode,
                street: shippingStreet,
                region: shippingRegion,
                customerName: shippingCustomerName,
            },
        } = creditCardConfig;

        const { payment } = savedTokenizeResponse;

        const additional3DSfields = () => {
            if (!is3DS) return;

            return {
                billingAddress: {
                    city: billingCity,
                    country: billingCountry,
                    firstName: billingCustomerName,
                    postalCode: billingPostCode,
                    street: billingStreet,
                    region: billingRegion,
                },
                shippingAddress: {
                    city: shippingCity,
                    country: shippingCountry,
                    firstName: shippingCustomerName,
                    postalCode: shippingPostCode,
                    street: shippingStreet,
                    region: shippingRegion,
                },
            };
        };

        const additionalAuthorizationFields = () => {
            if (!threeDSecure) return;

            return {
                threeDSecure,
            };
        };

        return {
            amount: {
                value: total,
                currency: currencyCode,
            },
            payment,
            useVerifiableResponse: true,
            ...additionalAuthorizationFields(),
            ...additional3DSfields(),
        };
    }

    isTokenResponseValid(
        tokenResponse: ITokenVerificationResponse
    ): IAuthResponse {
        const {
            isValid,
            isSuccess,
            isAuthorized = null,
            isSecure = null,
            threeDSecureInfo = null,
        } = tokenResponse;

        const errorList = {
            isValid: {
                condition: !isValid,
                errorMessage: "JWT corrupted",
            },
            isSuccess: {
                condition: !isSuccess,
                errorMessage: "JWT server error",
            },
            isSecure: {
                condition: isSecure === false,
                errorMessage: "JWT payment security problem",
            },
            isAuthorized: {
                condition: isAuthorized === false,
                errorMessage: "JWT payment not authorized",
            },
        };

        const checkErrors = () => {
            Object.values(errorList).forEach((values) => {
                if (values.condition) {
                    this.errorHandler(values.errorMessage);
                    errorsCount++;
                }
            });
        };

        let errorsCount = 0;

        checkErrors();

        if (errorsCount > 0) return { isTokenValid: false, response: null };

        this.successHandler("JWT valid");

        return { isTokenValid: isValid, response: threeDSecureInfo };
    }

    errorHandler(errorMessage: string): void {
        this.$rootScope.$broadcast("EVENT:CreditCardError");
        console.error("[ERROR]:", errorMessage);
    }

    successHandler(successMessage: string): void {
        this.$rootScope.$broadcast("EVENT:CreditCardSuccess");
        console.log("[SUCCESS]:", successMessage);
    }

    creditCardChecker(paymentName: string): boolean {
        if (!paymentName) return false;
        return paymentName.toLowerCase().includes("credit");
    }
}
