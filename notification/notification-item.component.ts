import * as angular from "angular";
import { IContactUsBtnService } from "../contact-us/contact-us-btn.service";
import { INotificationStorageService } from "./services/notification.storage.service";

export interface INotificationItem {
    id: string;
    topic: string;
    text: string;
}

class NotificationItemController {
    isClosed: boolean = false;
    topic: string = "";
    text: string = "";
    id: string = "";

    static $inject = ["contactUsBtnService", "notificationStorageService"];

    constructor(
        private readonly contactUsBtnService: IContactUsBtnService,
        private readonly notificationStorageService: INotificationStorageService
    ) {}

    closeNotification(): void {
        this.isClosed = true;

        // save to localStorage
        this.notificationStorageService.save(this.id);
    }

    openContactUs(): void {
        this.contactUsBtnService.openForm();
    }
}

export class NotificationItemComponent implements angular.IComponentOptions {
    static selector = "notificationItem";
    static controller = NotificationItemController;
    static templateUrl = "/notification-item";
    static bindings = {
        topic: "@",
        text: "@",
        id: "@",
    };
}
