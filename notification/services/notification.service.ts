export interface INotificationService {
    hasNotificationBeenNotShownFor1Day(item: string): boolean;
}

export class NotificationService implements INotificationService {
    private _oneDay: number = 60000 * 60 * 24;
    
    hasNotificationBeenNotShownFor1Day(item: string): boolean {
        return this.calculateTimeDifference(item) > this._oneDay;
    }

    private calculateTimeDifference(item: string): number {
        const currentTimestamp = Date.now();
        const itemFoundTimestamp = +item;

        return currentTimestamp - Number(itemFoundTimestamp);
    }
}
