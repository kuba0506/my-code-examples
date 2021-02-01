import * as angular from "angular";

import {
    ICreditCardPayments,
    ICreditCardApiService,
    ICreditCardHelpers,
    SavedTokenizeResponse,
    RapidPay,
    ICreditCardConfig,
    IAuthResponse,
} from "./credit-card.interface";

export class CreditCardPaymentsService implements ICreditCardPayments {
    static $inject = [
        "$window",
        "$timeout",
        "$rootScope",
        "creditCardApiService",
        "creditCardHelpers",
    ];

    constructor(
        public readonly $window: angular.IWindowService,
        private readonly $timeout: angular.ITimeoutService,
        private readonly $rootScope: angular.IRootScopeService,
        private readonly creditCardApiService: ICreditCardApiService,
        private readonly creditCardHelpers: ICreditCardHelpers
    ) {
        $rootScope.$on("EVENT:CreditCardError", () => {
            this.$timeout(() => {
                this.setCreditCardError(true);
            }, 0);
        });
        $rootScope.$on("EVENT:CreditCardSuccess", () => {
            this.$timeout(() => {
                this.setCreditCardError(false);
            }, 0);
        });
    }

    private _rapidPay = new RapidPay();
    private _savedTokenizeResponse = new SavedTokenizeResponse();
    private _isError: boolean = false;

    get isCreditCardError(): boolean {
        return this._isError;
    }

    get isCreditCardAccepted(): boolean {
        return !!this._savedTokenizeResponse.payment;
    }

    async open(creditCardConfig: ICreditCardConfig): Promise<void> {
        try {
            const token = await this.creditCardApiService.getToken();

            if (!token) {
                throw new Error("Token corrupted or server error!");
            }

            const openRapidPay = (authorizationToken: string): RapidPay => {
                if (!this.$window.DelegoRapidPay) {
                    throw new Error(
                        "window.DelegoRapidPay is not defined, perhaps script is missing"
                    );
                }

                const {
                    currencyCode,
                    total,
                    locale,
                    url,
                    sorg,
                } = creditCardConfig;

                const config = {
                    url,
                    token: authorizationToken,
                    paymentRequest: {
                        currencyCode,
                        total,
                    },
                    sorg,
                    locale,
                    element: "#delego-rapid-pay",
                    iframeclass: "fit-to-parent",
                };

                const events = {
                    events: {
                        onApplicationInitialized: () => {
                            this.creditCardHelpers.successHandler(
                                "EVENT:onApplicationInitialized"
                            );
                        },
                        onTokenizeSuccess: async (
                            tokenizeResponse: SavedTokenizeResponse,
                            signedTokenizeResponse: string
                        ): Promise<void> => {
                            try {
                                this._savedTokenizeResponse = tokenizeResponse;

                                this.creditCardHelpers.isTokenResponseValid(
                                    await this.creditCardApiService.verifyToken(
                                        signedTokenizeResponse
                                    )
                                );
                            } catch (error) {
                                this.creditCardHelpers.errorHandler(
                                    error.message
                                );
                            }
                        },
                        onChangePaymentMethodClicked: () => {
                            // reset CREDIT CARD accept response when user click on change button
                            this._savedTokenizeResponse = new SavedTokenizeResponse();
                            this.creditCardHelpers.successHandler(
                                "onChangePaymentMethodClicked"
                            );
                            this.$rootScope.$broadcast(
                                "EVENT:isButtonDisabled"
                            );
                        },
                        onFailure: (error: any) => {
                            this.creditCardHelpers.errorHandler(error.message);
                        },
                    },
                };

                return this.$window.DelegoRapidPay.open({
                    ...config,
                    ...events,
                });
            };

            this._rapidPay = openRapidPay(token);
        } catch (error) {
            this.creditCardHelpers.errorHandler(error.message);
        }
    }

    async authorize(
        creditCardConfig: ICreditCardConfig,
        threeDSecure: string = ""
    ): Promise<IAuthResponse | undefined> {
        try {
            const authorizeRequest = {
                ...this.creditCardHelpers.createAuthRequest({
                    creditCardConfig,
                    savedTokenizeResponse: this._savedTokenizeResponse,
                    is3DS: false,
                    threeDSecure,
                }),
            };

            const authorizeResponse = await this._rapidPay.authorize(
                authorizeRequest
            );

            if (!authorizeResponse) throw new Error("Authorization is null.");

            const validationResult = this.creditCardHelpers.isTokenResponseValid(
                await this.creditCardApiService.verifyAuthorizeToken(
                    authorizeResponse
                )
            );
            const { isTokenValid } = validationResult;

            return {
                isTokenValid,
                response: authorizeResponse,
            };
        } catch (error) {
            this.creditCardHelpers.errorHandler(error.message);
        }

        return;
    }

    async authenticate3DS(
        creditCardConfig: ICreditCardConfig
    ): Promise<IAuthResponse | undefined> {
        try {
            const authenticateRequest = {
                ...this.creditCardHelpers.createAuthRequest({
                    creditCardConfig,
                    savedTokenizeResponse: this._savedTokenizeResponse,
                    is3DS: true,
                }),
            };

            const authenticateResponse: string = await this._rapidPay.authenticate(
                authenticateRequest
            );

            if (!authenticateResponse) throw new Error("3DS is null.");

            const validationResult = this.creditCardHelpers.isTokenResponseValid(
                await this.creditCardApiService.verify3DsToken(
                    authenticateResponse
                )
            );

            const { isTokenValid, response } = validationResult;

            return { isTokenValid, response };
        } catch (error) {
            this.creditCardHelpers.errorHandler(error.message);
        }

        return;
    }

    private setCreditCardError(value: boolean = true) {
        this._isError = value;
    }
}
