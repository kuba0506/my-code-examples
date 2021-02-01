export interface ICreditCardPayments {
    open(creditCardConfig: ICreditCardConfig): Promise<void>;
    authorize(
        creditCardConfig: ICreditCardConfig,
        tokenizeResponse?: string
    ): Promise<IAuthResponse | undefined>;
    authenticate3DS(
        creditCardConfig: ICreditCardConfig
    ): Promise<IAuthResponse | undefined>;
    readonly isCreditCardError: boolean;
    readonly isCreditCardAccepted: boolean;
}

export interface ICreditCardHelpers {
    createAuthRequest(object: IAuthRequestConfig): IAuthObject;
    isTokenResponseValid(object: ITokenVerificationResponse): IAuthResponse;
    errorHandler(errorMessage: string): void;
    successHandler(successMessage: string): void;
    creditCardChecker(paymentName: string): boolean;
}

export interface IAuthObject {
    amount: {
        value: number;
        currency: string;
    };
    payment: any;
    useVerifiableResponse: boolean;
    billingAddress?: IAddress;
    shippingAddress?: IAddress;
    threeDSecure?: string;
}

export interface IAddress {
    city: string;
    country: string;
    firstName: string;
    postalCode: string;
    street: string;
}

export interface IAuthRequestConfig {
    creditCardConfig: ICreditCardConfig;
    savedTokenizeResponse: SavedTokenizeResponse;
    is3DS?: boolean;
    threeDSecure?: string;
}

export interface ICreditCardApiService {
    getToken(): any;
    verifyToken(token: string): any;
    verifyAuthorizeToken(token: string): any;
    verify3DsToken(token: string): any;
}

export interface ISAPAddress {
    city: string;
    country: string;
    postCode: string;
    street: string;
    region: string;
    customerName: string;
}

export interface ICreditCardConfig {
    currencyCode: string;
    customerName: string;
    total: number;
    url: string;
    locale: string;
    sorg: string;
    billingAddress: ISAPAddress;
    deliveryAddress: ISAPAddress;
}

export interface IToken {
    token: string;
    success: boolean;
}

export interface ITokenVerificationResponse {
    isValid: boolean;
    isSuccess: boolean;
    isAuthorized?: boolean;
    isSecure?: boolean;
    message?: string;
    threeDSecureInfo?: any;
}

export interface IErrors {
    acceptError: boolean;
    authorizeError: boolean;
}

export interface IAuthResponse {
    isTokenValid: boolean;
    response?: any;
}

export class RapidPay {
    authenticate(authenticateRequest: any): Promise<any> {
        return Promise.resolve(authenticateRequest);
    }
    authorize(authorizeRequest: any): Promise<any> {
        return Promise.resolve(authorizeRequest);
    }
}

export class SavedTokenizeResponse {
    payment: any;
}
