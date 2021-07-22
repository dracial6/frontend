import { Guid } from "guid-typescript";
import { IDataItem, PropertyChangedEvent } from "..";
import OpCodes from "../structures/OpCodes";

class BaseDataItem implements IDataItem{
    guid: Guid = Guid.create();
    opCode: OpCodes = OpCodes.NONE;
    key = "NOT_ASSIGNED_KEY";
    lockNotifyPropertyChanged = true;
    backupItem: BaseDataItem | undefined = undefined;
    propertyChanged: PropertyChangedEvent = new PropertyChangedEvent();

    notifyPropertyChanged(propertyName: string): void {
        if (this.lockNotifyPropertyChanged) return;

        if (this.opCode === OpCodes.READ || this.opCode === OpCodes.DELETE) {
            this.opCode = OpCodes.UPDATE;
        }

        this.setPropertyChanged(propertyName);
    }

    setPropertyChanged(propertyName: string) {
        if (!this.propertyChanged.isEmpty()) {
            this.propertyChanged.doEvent(propertyName);
        }
    }

    makeBackupItem(): void {
        this.lockNotifyPropertyChanged = false;
        if (this.backupItem !== undefined) this.backupItem = undefined;
        this.backupItem = JSON.parse(JSON.stringify(this));
    }
}

export default BaseDataItem;