import BaseItemList from "../../../common/items/BaseItemList";
import BlockItem from "./BlockItem";

class BlockItemList extends BaseItemList<BlockItem> {
    private _sortedMapIndex = new Map<number, BlockItem>();
    private _sortedMapNo = new Map<string, BlockItem>();

    constructor(list: BlockItem[]) {
        super(list, true);
        super.push(...list);
    }

    initializeList(): void {
        this._sortedMapIndex.clear();
        this._sortedMapNo.clear();
    }

    isBlock(blockName: string): boolean {
        if (blockName === "") return false;

        if (this._sortedMapNo.has(blockName))
            return true;
        else
            return false;
    }

    getMap(): Map<string, BlockItem> {
        return super.getSortedMap<string>("a");
    }

    getMapIndex(): Map<number, BlockItem> {
        return new Map(Array.from(this._sortedMapIndex.entries()).sort());
    }

    getMapNo(): Map<string, BlockItem> {
        return new Map(Array.from(this._sortedMapNo.entries()).sort());
    }

    getList(): BlockItem[] {
        return this;
    }

    getBlockByKey(key: string): BlockItem | undefined {
        if (key === "") return undefined;

        if (this._sortedMapNo.has(key)) {
            return this._sortedMapNo.get(key);
        } else {
            return undefined;
        }
    }

    getBlockByIndex(index: number): BlockItem | undefined {
        if (this._sortedMapIndex.has(index)) {
            return this._sortedMapIndex.get(index);
        } else {
            return undefined;
        }
    }

    private addRangeItem(list: BaseItemList<BlockItem>): void {
        list.forEach(element => {
            this.add(element);
        });
    }

    addEntry(key: string, blockItem: BlockItem): boolean {
        this.add(blockItem);
        return super.addEntry(key, blockItem);
    }

    private add(item: BlockItem): void {
        if (this._sortedMapIndex.has(item.index) == false) this._sortedMapIndex.set(item.index, item);
        if (this._sortedMapNo.has(item.getName()) == false) this._sortedMapNo.set(item.getName(), item);
    }

    removeEntry(key: string): boolean {
        this.remove(key);
        return super.removeItem(key);
    }

    private remove(key: string): void {
        const block = this.getBlockByKey(key);

        if (block) {
            if (this._sortedMapIndex.has(block.index) == false) this._sortedMapIndex.delete(block.index);
            if (this._sortedMapNo.has(block.getName()) == false) this._sortedMapNo.delete(block.getName());
        }
    }

    clear(): void {
        this._sortedMapIndex.clear();
        this._sortedMapNo.clear();
        this.length = 0;
    }
}

export default BlockItemList;