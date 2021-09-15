import BaseDrawableObject from "./BaseDrawableObject";
import IBaseGeometry from "./IBaseGeometry";
import IDrawableGeometry from "./IDrawableGeometry";

class GeometryLayer {
    private _geomList: IBaseGeometry[] = [];

    public addGeomObject(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject): void {
        this.addGeomObjectBackground(geomObj, parentGeom, true);
    }

    public addGeomObjectBackground(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject, isBackground: boolean): void {
        this.insertGeomObject(geomObj, parentGeom, isBackground, 0);
    }

    public insertGeomObject(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject, isBackground: boolean, index: number): void {
        if ("IDrawableGeometry" in geomObj) {
            (geomObj as IDrawableGeometry).isMemberGeomGroup = true;
            (geomObj as IDrawableGeometry).isBackground = isBackground;
        }

        geomObj.parentGeometry = parentGeom;
        geomObj.isChanged = true;

        this._geomList.splice(index, 0, geomObj);
    }

    public removeGeomObjectKey(key: string): void {
        const baseGeom = this.getGeomObject(key);

        if (baseGeom) {
            this.removeGeomObject(baseGeom);
        }
    }

    public removeGeomObject(geomObj: IBaseGeometry): void {
        if (this._geomList.length === 0) return;
        const index = this._geomList.indexOf(geomObj);
        if (index < 0) return;

        this._geomList.splice(index, 1);
    }

    public clearGeomObject(): void {
        this._geomList.length = 0;
    }

    public getGeomList(): IBaseGeometry[] {
        return this._geomList;
    }

    public getGeomObject(key: string): IBaseGeometry | undefined {
        if (this._geomList.length === 0) return undefined;

        for (const element of this._geomList) {
            if (element.name === key) {
                return element;
            }
        }
    }

    public getGeomObjectIndex(key: string): number {       
        for (const element of this._geomList) {
            if (element.name === key) {
                return this._geomList.indexOf(element);
            }
        }

        return -1;
    }

    public getGeomListType(memberName: string): IBaseGeometry[] {
        if (this._geomList.length === 0 || !memberName) return [];
        
        const resultList: IBaseGeometry[] = [];
        for (let i = 0, element; element = this._geomList[i]; i++) {
            if (memberName in element) {
                resultList.push(element);
            }
        }

        return resultList;
    }

    public moveFirstKey(key: string): boolean {
        return this.moveFirst(this.getGeomObject(key));
    }

    public moveFirst(geomObj: IBaseGeometry | undefined): boolean {
        if (this._geomList.length === 0 || !geomObj) return false;

        let index = -1;
        for (let i = 0, element; element = this._geomList[i]; i++) {
            if (element.name === geomObj.name) {
                index = i;
                const temp = this._geomList.splice(index, 1)[0];
                this._geomList.splice(0, 0, temp);
                break;
            }
        }

        return index >= 0;
    }

    public moveLastKey(key: string): boolean {
        return this.moveLast(this.getGeomObject(key));
    }

    public moveLast(geomObj: IBaseGeometry | undefined): boolean {
        if (this._geomList.length === 0 || !geomObj) return false;

        let index = -1;
        for (let i = 0, element; element = this._geomList[i]; i++) {
            if (element.name === geomObj.name) {
                index = i;
                const temp = this._geomList.splice(index, 1)[0];
                this._geomList.push(temp);
                break;
            }
        }

        return index >= 0;
    }    

    public moveToIndex(geomObj: IBaseGeometry | undefined, index: number): boolean {
        if (!geomObj) return false;

        return this.moveToIndexKey(geomObj.name, index);
    }

    public moveToIndexKey(key: string, index: number): boolean {
        if (!key || key === '' || index < 0) return false;

        let indexOf = -1;
        for (let i = 0, element; element = this._geomList[i]; i++) {
            if (element.name === key) {
                indexOf = i;
                const temp = this._geomList.splice(indexOf, 1)[0];
                this._geomList.splice(index, 0, temp);
                break;
            }
        }

        return indexOf >= 0;
    }
}

export default GeometryLayer;