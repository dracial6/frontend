import DrawableObject from "../../../drawing/elements/DrawableObject";
import DrawLine from "../../../drawing/elements/DrawLine";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import { Color, Size } from "../../../drawing/structures";
import ViewDirection from "../structures/ViewDirection";

class TCloseButton extends DrawableObject {
    private _block: string;
    private _bayRow: number;
    private _viewType: ViewDirection;
    private _btnSize: number;
    private _lineThick: number;
    private _background: DrawRectangle;

    getBlock(): string {
        return this._block;
    }

    getBayRow(): number {
        return this._bayRow;
    }

    getViewType(): ViewDirection {
        return this._viewType;
    }

    constructor(viewType: ViewDirection, block: string, bayRow: number, size: number, lineThick: number) {
        super("CloseButton");
        this.enableMouseOver = true;
        this._block = block;
        this._bayRow = bayRow;
        this._viewType = viewType;
        this._btnSize = size;
        this._lineThick = lineThick;

        this.clearGeomObject();
        this._background = new DrawRectangle(this.name + "_R");
        this._background.attribute.lineColor = Color.Red();
        this._background.attribute.fillColor = Color.Red();
        this._background.setSize(new Size(this._btnSize, this._btnSize));
        this.addGeomObject(this._background);
        
        const line = new DrawLine(this.name + "_L1", this._btnSize * 2 / 10, this._btnSize * 2 / 10
        , this._btnSize - this._btnSize * 2 / 10, this._btnSize - this._btnSize * 2 / 10);
        line.attribute.lineThick = this._lineThick;
        line.attribute.lineColor = Color.White();
        this.addGeomObject(line);

        const lineLocation = line.getLocation();
        const lineSize = line.getSize();
        const line2 = new DrawLine(this.name + "_L2", lineLocation.x
        , lineSize.height + lineLocation.y
        , lineSize.width + lineLocation.x
        , lineLocation.x);
        line2.attribute.lineThick = this._lineThick;
        line2.attribute.lineColor = Color.White();
        this.addGeomObject(line2);

        this.setSize(new Size(size, size));
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        this._background.attribute.lineColor = Color.Blue();
        this._background.attribute.fillColor = Color.Blue();
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        this._background.attribute.lineColor = Color.Red();
        this._background.attribute.fillColor = Color.Red();
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

export default TCloseButton;