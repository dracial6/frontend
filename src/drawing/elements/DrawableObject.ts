import GeneralLogger from "../../logger/GeneralLogger";
import DrawableUtil from "../../utils/DrawableUtil";
import BaseDrawableObject from "./BaseDrawableObject";
import GeometryLayer from "./GeometryLayer";
import IBaseGeometry from "./IBaseGeometry";
import IDrawable from "./IDrawable";
import { Rectangle } from "../structures";

abstract class DrawableObject extends BaseDrawableObject {
    private _defaultLayer = new GeometryLayer();

    public drawGeometry(ctx: CanvasRenderingContext2D): void {
        try {
            const geomList = this.getGeomList();
            const count = geomList.length;
            for (let idx = count - 1; idx >= 0; idx--) {
                const geom = geomList[idx];
                if (!geom.visible) continue;

                if (geom instanceof BaseDrawableObject) {
                    const canvasBound = ctx.canvas.getBoundingClientRect();
                    (geomList[idx] as IDrawable).drawDetail(ctx, 1, new Rectangle(0, 0, canvasBound.width, canvasBound.height), false);
                } else  {
                    (geomList[idx] as IDrawable).draw(ctx);
                }
            }
        } catch (error) {
            GeneralLogger.error(error);
        }
    }

    public drawGeometryCache(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void {
        if (!isMemoryCache) {
            this.drawNormal(ctx, this.getGeomList(), viewBoundary, isMemoryCache);
        } else {
            this.drawImage(ctx, this.getGeomList(), viewBoundary, isMemoryCache);
        }
    }

    public getGeomList(): IBaseGeometry[] {
        return this._defaultLayer.getGeomList();
    }

    public getGeomListByMember(memberName: string): IBaseGeometry[] {
        return this._defaultLayer.getGeomListType(memberName);
    }

    protected getDefaultLayer(): GeometryLayer {
        return this._defaultLayer;
    }

    protected setDefaultLayer(layer: GeometryLayer): void {
        this._defaultLayer = layer;
    }

    protected calculateAncher(): void {
        if (this.getGeomList().length === 0) return;

        this.getGeomList().forEach((element) => {
            DrawableUtil.calculateAncher(this, element);
        });
    }
}

export default DrawableObject;