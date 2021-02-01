import { IStorageService } from "../../shared/storage/storage.service";

export interface INotificationStorageService {
    get(id: string): string;
    save(id: string): void;
}

export class NotificationStorageService implements INotificationStorageService {
    private _itemName = "NotificationID";

    static $inject = ["storageService"];

    constructor(private readonly storageService: IStorageService) {}

    get(id: string): string {
        return this.storageService.get(`${this._itemName}-${id}`);
    }

    save(id: string): void {
        return this.storageService.save(
            `${this._itemName}-${id}`,
            String(Date.now()),
            false
        );
    }
}
