import DrawableObject from "../../../drawing/elements/DrawableObject";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import { Color, ContentAlignment, Rectangle } from "../../../drawing/structures";
import GeneralLogger from "../../../logger/GeneralLogger";
import ChassisDisplayItem from "../../common/items/ChassisDisplayItem";

class TChassis extends DrawableObject {
    TChassis = 0;

    private _dwItem : ChassisDisplayItem;
    private _zoomRate : number;
    private _fontRate : number;

    getDwItem() : ChassisDisplayItem {
        return this._dwItem;
    }
    
    constructor(name: string, item: ChassisDisplayItem, zoomRate: number, fontRate: number) {
        super(name);
        this._dwItem = item;
        this._zoomRate = zoomRate;
        this._fontRate = fontRate;
    }

    private drawChassis(ctx: CanvasRenderingContext2D) : void {
        try {
            const boardRect = new DrawRectangle("");
            boardRect.setLocation(super.getCurrentLocation());
            boardRect.setSize(super.getCurrentSize());
            boardRect.attribute.lineColor = Color.Black();
            boardRect.attribute.lineThick = 2.0;
            boardRect.attribute.fillColor = this._dwItem.backColor;
            boardRect.draw(ctx);            
            const name = new DrawText("");
            name.attribute.fontName = "Tahoma";
            name.attribute.fontSize = this._dwItem.name.fontSize * this._zoomRate + this._fontRate;
            name.attribute.fontStyle = this._dwItem.name.getTextStyle();
            name.setLocation(this.getCurrentLocation());
            name.setSize(this.getCurrentSize());
            name.attribute.textAlign = ContentAlignment.MiddleCenter;
            name.attribute.lineColor = this._dwItem.name.textColor;
            name.text = this._dwItem.name.text;
            name.draw(ctx);
        } catch (ex) {
            GeneralLogger.error(ex);
        }
    }

    setData(item: ChassisDisplayItem) : void {
        this._dwItem = item;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCatch: boolean) : void {
        this.drawChassis(ctx);
    }

    onMouseDown(sender: any, e: MouseEvent) : void  { }
    onMouseMove(sender: any, e: MouseEvent) : void  { }
    onMouseUp(sender: any, e: MouseEvent) : void  { }
    onSelected(sender: any, e: MouseEvent) : void  { }
    onMouseHover(sender: any, e: MouseEvent) : void  { }
    onMouseLeave(sender: any, e: MouseEvent) : void  { }
    onMouseClick(sender: any, e: MouseEvent) : void  { }
    onResize(sender: any, e: MouseEvent) : void  { }
}
    
export default TChassis;