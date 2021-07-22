import RowItem from "../shipplan/items/RowItem";
import IDrawableGeometry from "./IDrawableGeometry";

class DrawLayer {
    protected _drawList: IDrawableGeometry[] = [];

    add(obj: IDrawableGeometry): void {
        this.addCheckDuplication(obj, true);
    }

    addCheckDuplication(obj: IDrawableGeometry, checkDuplication: boolean): void {
        if (this.invalidateCheckObject(obj)) return;

        if (checkDuplication) {
            if (this.getIndex(obj) > -1) return;
        }

        this._drawList.splice(0, 0, obj);
    }

    insert(index: number, obj: IDrawableGeometry): void {
        if (this.invalidateCheckObject(obj)) return;

        if (index >= 0 && index < this._drawList.length) {
            this._drawList.splice(index, 0, obj);
        }
    }

    update(obj: IDrawableGeometry): void {
        const index = this.getIndex(obj);

        if (this.invalidateCheckObject(obj)) return;

        if (index >= 0 && index < this._drawList.length) {
            this._drawList[index] = obj;
        }
    }    

    remove(obj: IDrawableGeometry): void {
        const index = this.getIndex(obj);

        if (this.invalidateCheckObject(obj)) return;

        if (index >= 0 && index < this._drawList.length) {
            this._drawList.splice(index, 1);
        }
    }

    removeKey(key: string): void {
        this.removeAt(this.getIndexKey(key));
    }

    removeAt(index: number): void {
        if (this._drawList.length === 0) return;
        this._drawList.splice(index, 1);
    }

    getIndex(obj: IDrawableGeometry): number {
        if (this.invalidateCheckObject(obj)) return -1;
        return this.getIndexKey(obj.name);
    }

    getIndexKey(key: string): number {
        if (this._drawList.length === 0) return -1;

        for (let i = 0; i < this._drawList.length; i++) {
            if (this._drawList[i].name === key) {
                return i;
            }
        }

        return -1;
    }

    private invalidateCheckObject(obj: IDrawableGeometry): boolean {
        return !obj;
    }

    getDrawList(): IDrawableGeometry[] {
        return this._drawList;
    }

    get(index: number): IDrawableGeometry | undefined {
        if (this._drawList.length === 0) return undefined;
        if (index < 0 || index >= this._drawList.length) return undefined;
        return this._drawList[index];
    }

    getWithKey(geomKey: string): IDrawableGeometry | undefined {
        if (this._drawList.length === 0) return undefined;
        this.getDrawList().forEach((element) => {
            if (element.name === geomKey) return element;
        })
    }

    moveSelectionToTop(): boolean {
        if (this._drawList.length === 0) return false;

        const tempList = [];

        for (let i = this._drawList.length - 1; i >= 0; i--) {
            if (this._drawList[i].isSelected) {
                tempList.push(this._drawList[i]);
                this._drawList.splice(i, 1);
            }
        }

        for (let i = 0; i < tempList.length; i++) {
            this._drawList.splice(0, 0, tempList[i]);
        }

        return tempList.length > 0;
    }

    moveObjToForward(obj: IDrawableGeometry): boolean {
        if (this._drawList.length === 0) return false;

        let selectedIndex = -1;
        for(let i = 0; i < this._drawList.length; i++){
            if (obj.name === this._drawList[i].name) {
                selectedIndex = i;
                break;
            }
        }

        if (selectedIndex <= 0) {
            return false;
        }

        let select = this._drawList[selectedIndex];
        let previous = this._drawList[selectedIndex - 1];
        const temp = select;
        select = previous;
        previous = temp;
        this._drawList[selectedIndex] = select;
        this._drawList[selectedIndex - 1] = previous;

        return true;
    }

    moveObjsToForward(list: IDrawableGeometry[]): boolean {
        if (this._drawList.length === 0) return false;

        for(let i = 0; i < list.length; i++) {
            let selectedIndex = -1;
            for(let j = 0; j < this._drawList.length; j++){
                if (list[i].name === this._drawList[j].name) {
                    selectedIndex = j;
                    break;
                }
            }

            if (selectedIndex <= 0) {
                continue;
            }

            let select = this._drawList[selectedIndex];
            let previous = this._drawList[selectedIndex - 1];
            const temp = select;
            select = previous;
            previous = temp;
            this._drawList[selectedIndex] = select;
            this._drawList[selectedIndex - 1] = previous;
        }

        return true;
    }

    moveSelectionToBottom(): boolean {
        if (this._drawList.length === 0) return false;

        const tempList = [];

        for (let i = this._drawList.length; i >= 0; i--) {
            if (this._drawList[i].isSelected) {
                tempList.push(this._drawList[i]);
                this._drawList.splice(i, 1);
            }
        }

        for (let i = 0; i < tempList.length; i++) {
            this._drawList.push(tempList[i]);
        }

        return tempList.length > 0;
    }

    moveToTop(key: string): boolean {
        if (this._drawList.length === 0) return false;

        let flag = false;
        let target;
        for (let i = 0; i < this._drawList.length; i++) {
            if (this._drawList[i].name === key) {
                target = this._drawList[i];
                this._drawList.splice(i, 1);
                flag = true;
                break;
            }
        }

        if (target) this._drawList.splice(0, 0, target);

        return flag;
    }

    moveToBottom(key: string): boolean {
        if (this._drawList.length === 0) return false;

        let flag = false;
        let target;
        for (let i = 0; i < this._drawList.length; i++) {
            if (this._drawList[i].name === key) {
                target = this._drawList[i];
                this._drawList.splice(i, 1);
                flag = true;
                break;
            }
        }

        if (target) this._drawList.push(target);

        return flag;
    }

    moveToIndex(key: string, index: number): boolean {
        if (this._drawList.length === 0) return false;

        let flag = false;
        let target;
        for (let i = 0; i < this._drawList.length; i++) {
            if (this._drawList[i].name === key) {
                target = this._drawList[i];
                this._drawList.splice(i, 1);
                flag = true;
                break;
            }
        }

        if (target) this._drawList.splice(index, 0, target);

        return flag;
    }
}

export default DrawLayer;