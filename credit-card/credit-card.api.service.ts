import { IApiService } from "../../../core/API/api.service";
import { IApiUrl } from "../../../core/constants/constants";
import {
    ICreditCardApiService,
    ICreditCardHelpers,
} from "./credit-card.interface";

export class CreditCardApiService implements ICreditCardApiService {
    static $inject = ["API", "API_URL", "creditCardHelpers"];

    constructor(
        private readonly API: IApiService,
        private readonly API_URL: IApiUrl,
        private readonly creditCardHelpers: ICreditCardHelpers
    ) {}

    getToken(): any {
        return (
            this.API.get(`${this.API_URL.jwtApi}/gettoken`)
                .then((response: any) => response.token)
                .catch((error) => {
                    this.creditCardHelpers.errorHandler(error.message);
                })
        );
    }

    verifyToken(token: string): any {
        return this.API.post(`${this.API_URL.jwtApi}/verifytoken`, {
            token,
        }).catch((error) => {
            this.creditCardHelpers.errorHandler(error.message);
        });
    }

    verifyAuthorizeToken(token: string): any {
        return this.API.post(`${this.API_URL.jwtApi}/verifyauthorizetoken`, {
            token,
        }).catch((error) => {
            this.creditCardHelpers.errorHandler(error.message);
        });
    }

    verify3DsToken(token: string): any {
        return this.API.post(`${this.API_URL.jwtApi}/verify3dstoken`, {
            token,
        }).catch((error) => {
            this.creditCardHelpers.errorHandler(error.message);
        });
    }
}
