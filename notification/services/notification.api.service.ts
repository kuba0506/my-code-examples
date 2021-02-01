import * as angular from "angular";
import { IApiService } from "../../core/API/api.service";
import { IApiUrl } from "../../core/constants/constants";
import { INotificationItem } from "../notification-item.component";

export interface INotificationApiService {
    getNotifications(): angular.IPromise<Array<INotificationItem>>;
}

export class NotificationApiService implements INotificationApiService {
    static $inject = ["API", "API_URL"];

    constructor(
        private readonly API: IApiService,
        private readonly API_URL: IApiUrl
    ) {}

    getNotifications(): angular.IPromise<Array<INotificationItem>> {
        return this.API.get(`${this.API_URL.notifications}`).then(
            ({ notifications }: any) => notifications
        );
    }
}
