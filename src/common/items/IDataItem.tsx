import { Guid } from "guid-typescript";
import OpCodes from "../structures/OpCodes";
import BaseDataItem from "./BaseDataItem";

interface IDataItem {
    guid: Guid;
    opCode: OpCodes;
    key: string;
    lockNotifyPropertyChanged: boolean;
    backupItem: BaseDataItem | undefined;
    
    makeBackupItem(): void;
}

export default IDataItem;