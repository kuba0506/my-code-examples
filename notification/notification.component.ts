import * as angular from "angular";
import { INotificationItem } from "./notification-item.component";
import { INotificationApiService } from "./services/notification.api.service";
import { INotificationService } from "./services/notification.service";
import { INotificationStorageService } from "./services/notification.storage.service";

class NotificationController {
    notifications: Array<INotificationItem> = [];
    private _areNotificationsLoaded: boolean = false;
    private _notificationCount: number = 0;

    static $inject = [
        "notificationApiService",
        "notificationStorageService",
        "notificationService",
    ];

    constructor(
        private readonly notificationApiService: INotificationApiService,
        private readonly notificationStorageService: INotificationStorageService,
        private readonly notificationService: INotificationService
    ) {
        this.getNotifications();
    }

    get isAnyNotification(): boolean {
        return this._areNotificationsLoaded && this._notificationCount > 0;
    }

    private getNotifications(): angular.IPromise<void> {
        return this.notificationApiService
            .getNotifications()
            .then((notifications: Array<INotificationItem>) => {
                this.notifications = this.filterNotifications(notifications);
                this._notificationCount = notifications.length;
                this._areNotificationsLoaded = true;
            });
    }

    // filter notifications, leaves only new ones or not shown for 1 day
    private filterNotifications(
        notifications: Array<INotificationItem>
    ): Array<INotificationItem> {
        if (notifications.length === 0) return notifications;

        const filteredNotifications = notifications.filter(
            (notification: INotificationItem) => {
                const { id } = notification;
                const notificationFoundTimestamp = this.notificationStorageService.get(
                    String(id)
                );

                // return notification if not found in storage
                if (!notificationFoundTimestamp) return notification;

                // return notification not shown for more than 1 day
                return this.notificationService.hasNotificationBeenNotShownFor1Day(
                    notificationFoundTimestamp
                );
            }
        );

        return filteredNotifications;
    }
}

export class NotificationComponent implements angular.IComponentOptions {
    static selector = "notification";
    static controller = NotificationController;
    static templateUrl = "/notification";
    static bindings = {};
}
