import SearchUtil from "../utils/SearchUtil";
import BaseDrawableList from "./BaseDrawableList";
import BaseDrawArea from "./BaseDrawArea";
import BaseDrawableObject from "./elements/BaseDrawableObject";
import DrawLayer from "./elements/DrawLayer";
import IDrawableGeometry from "./elements/IDrawableGeometry";

class DrawableList extends BaseDrawableList {
    private _drawList = new DrawLayer();

    constructor(isBringToTop: boolean) {
        super(isBringToTop);
    }

    clear(): void {
        if (this.invalidateDrawList()) return;
        const drawList = this.getDrawList();        
        this.clearMemoryCache();
        drawList.length = 0;
    }

    clearDrawableObject(): void {
        if (this.invalidateDrawList()) return;
        const drawList = this.getDrawList();
        const n = drawList.length;
        let object: IDrawableGeometry;

        for (let i = n - 1; i >= 0; i--) {
            object = drawList[i];

            if (object instanceof BaseDrawableObject) {
                drawList.splice(i, 1);
            }
        }
    }

    clearMemoryCache(): void {
        const drawList = this.getDrawList();
        if (drawList.length === 0) return;
        const list = SearchUtil.getGeometryListByMemberPoint(drawList, "isChanged", true, true, undefined);
        
        list.forEach(element => {
            if (element instanceof BaseDrawableObject) {
                (element as BaseDrawableObject).clearMemoryCache();
            }
            element.isChanged = true;
        });
    }

    getDrawList(): IDrawableGeometry[] {
        return this.getDefaultDrawLayer().getDrawList();
    }

    getDrawListAtEventHandle(): IDrawableGeometry[] {
        return this.getDefaultDrawLayer().getDrawList();
    }

    moveSelectionToTop(): boolean {
        return this.getDefaultDrawLayer().moveSelectionToTop();
    }

    moveObjToForward(geometry: IDrawableGeometry): boolean {
        return this.getDefaultDrawLayer().moveObjToForward(geometry);
    }

    moveObjsToForward(list: IDrawableGeometry[]): boolean {
        return this.getDefaultDrawLayer().moveObjsToForward(list);
    }

    moveSelectionToBottom(): boolean {
        return this.getDefaultDrawLayer().moveSelectionToBottom();
    }

    moveToTop(key: string): boolean {
        return this.getDefaultDrawLayer().moveToTop(key);
    }

    moveToBottom(key: string): boolean {
        return this.getDefaultDrawLayer().moveToBottom(key);
    }

    moveToIndex(key: string, index: number): boolean {
        return this.getDefaultDrawLayer().moveToIndex(key, index);
    }

    protected drawNormal(ctx: CanvasRenderingContext2D, drawArea: BaseDrawArea): void {
        this.drawGeometry(ctx, drawArea, this.getDefaultDrawLayer().getDrawList());
    }

    protected getDefaultDrawLayer(): DrawLayer {
        return this._drawList;
    }

    protected invalidateDrawList(): boolean {
        if (this.getDefaultDrawLayer().getDrawList().length === 0) return true;
        return false;
    }

    protected invalidateCheckObject(obj: IDrawableGeometry): boolean {
        if (this.invalidateDrawList()) return true;
        if (!obj) return true;

        return false;
    }
}

export default DrawableList;