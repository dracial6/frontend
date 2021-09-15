import { IDataItem } from "..";
import GeneralLogger from "../../logger/GeneralLogger";

class BaseItemList<T extends IDataItem> extends Array<T> {
    protected isChangedList = false;
    private _sortedListChangeRequired = false;
    private _sortedMap = new Map<any, T>();

    isBackupRequired = false;

    constructor(list: T[], isBackupRequired: boolean) {
        super();
        super.push(...list);
        this.isBackupRequired = isBackupRequired;
        this.setChangedStatus(true);
        this.unLockNotifyPropertyChangedList(list);
    }

    getItem(key: string): T | undefined {
        for(const element of this) {
            if (element.key === key) {
                return element;
            }
        }
    }

    getSortedMap<TKey>(sample: TKey): Map<TKey, T> {
        if (this._sortedListChangeRequired) {
            this._sortedMap.clear();
            this._sortedListChangeRequired = false;

            this.forEach(element => {
                const key = this.getKeyValue<TKey>(element.key, sample);

                if (key && !this._sortedMap.has(key)) {
                    this._sortedMap.set(key, element);
                }
            });

            return new Map(Array.from(this._sortedMap.entries()).sort());
        } else {
            return this._sortedMap;
        }
    }

    getItemByProp(propName: string, compareValue: any): T | undefined {
        try {
            if (compareValue) {
                for (const element of this) {
                    if ((element as any)[propName] === compareValue) {
                        return element;
                    }
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
        }
    }

    addEntry(key: string, item: T): boolean {
        if (!this.containsKey(key)) {
            item.key = key;
            this.addItem(item);
            return true;
        } else {
            return false;
        }
    }

    private addItem(item: T): void {
        this.push(item);
        this.setChangedStatus(true);
        this.unLockNotifyPropertyChanged(item);
    }

    removeItem(key: string): boolean {
        const index = this.findIndex(c => c.key === key);
        if (index >= 0) {
            this.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    containsKey(key: string): boolean {
        for (const element of this) {
            if (element.key === key) {
                return true;
            }
        }

        return false;
    }

    private unLockNotifyPropertyChangedList(list: T[]): void {
        list.forEach(element => {
            this.unLockNotifyPropertyChanged(element);
        });
    }

    private unLockNotifyPropertyChanged(item: IDataItem): void {
        if (!item.backupItem && this.isBackupRequired) {
            item.makeBackupItem();
        }
    }

    clear(): void {
        this._sortedMap.clear();
        this.length = 0;
        this.setChangedStatus(true);
    }

    setChangedStatus(isChanged: boolean): void {
        this.isChangedList = isChanged;
        this._sortedListChangeRequired = isChanged;
    }

    getKeyValue<TKey>(key: string, sample: TKey): TKey {
        const parseValue = key;
        
        if (Object.prototype.toString.call(sample).slice(8, -1) === "Number") {
            return parseInt(parseValue) as any as TKey;
        }

        return parseValue as any as TKey;
    }
}

export default BaseItemList;