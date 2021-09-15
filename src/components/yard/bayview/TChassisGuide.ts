import DrawableObject from "../../../drawing/elements/DrawableObject";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import TextBoxItem from "../../../drawing/items/TextBoxItem";
import { ContentAlignment, Rectangle, Size } from "../../../drawing/structures";
import GeneralLogger from "../../../logger/GeneralLogger";

class TChassisGuide extends DrawableObject {
    private _item : TextBoxItem;
    private _zoomRate : number;
    private _fontRate : number;

    getChassGuideItem() : TextBoxItem {
        return this._item;
    }

    constructor(name: string, item: TextBoxItem, zoomRate: number, fontRate: number) {
        super(name);
        this._item = item;
        this._zoomRate = zoomRate;
        this._fontRate = fontRate;
    }

    private drawChassisGuide(g: CanvasRenderingContext2D) : void {
        let guideName = undefined;
        let guideBoardRect = undefined;
        let padding = 0;
        
        try {
            guideName = new DrawText("");
            guideName.attribute.fontName = "Tahoma";
            guideName.attribute.fontSize = this._item.fontSize * this._zoomRate + this._fontRate;
            guideName.attribute.fontStyle = this._item.getTextStyle();
            guideName.attribute.textAlign = ContentAlignment.MiddleCenter;
            guideName.attribute.lineColor = this._item.textColor;
            guideName.text = this._item.text;
            guideName.setLocation(this.getCurrentLocation());
            
            if (this._item.text.length > 0) {
                padding = this.getCurrentSize().height - guideName.getRealTextSize().height;
            }

            guideName.setSize(new Size(guideName.getTextSize().width + padding, this.getCurrentSize().height));
            guideBoardRect = new DrawRectangle("");
            guideBoardRect.setLocation(this.getCurrentLocation());
            guideBoardRect.setSize(guideName.getSize());
            guideBoardRect.attribute.lineColor = this._item.borderColor;
            guideBoardRect.attribute.lineThick = 2;
            guideBoardRect.attribute.fillColor = this._item.backColor;
            guideBoardRect.draw(g);
            guideName.draw(g);
        } catch (ex) {
            GeneralLogger.error(ex);
        }
    }

    drawDetail(g: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCatch: boolean) : void {
        this.drawChassisGuide(g);
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

export default TChassisGuide;