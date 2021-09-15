import DrawableObject from "../../drawing/elements/DrawableObject";
import DrawText from "../../drawing/elements/DrawText";
import DrawVerticalText from "../../drawing/elements/DrawVerticalText";
import IDragable from "../../drawing/elements/IDragable";
import IGeometryToolTip from "../../drawing/elements/IGeometryToolTip";
import { Color, DashStyles, DrawTextDirection, FontStyles, Point, Rectangle, Size } from "../../drawing/structures";
import ColorUtil from "../../utils/ColorUtil";
import DrawableUtil from "../../utils/DrawableUtil";
import BoundaryItem from "./items/BoundaryItem";
import BoundaryMode from "./structures/BoundaryMode";

class TBoundary extends DrawableObject implements IGeometryToolTip, IDragable {    
    TBoundary = 0; // For Type Check;
    
    boundary: BoundaryItem;
    property?: TBoundaryProperty;
    isDragable = false;
    tooltipText = '';
    tooltipGroup = '';

    constructor(key: string, boundary: BoundaryItem) {
        super(key);
        this.boundary = boundary;
        this.enableResizable = false;
    }

    setIsSelected(isSelected: boolean): void {
        if (!this.property || !this.property.selectableBoundaryMode || this.boundary.boundaryType === this.property.selectableBoundaryMode) {
            this.isSelected = isSelected;
        } else {
            this.isSelected = false;
        }
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void {
        this.drawBoundary(ctx);
    }

    private drawBoundary(ctx: CanvasRenderingContext2D): void {
        this.drawPlanArea(ctx);
        this.drawPlanText(ctx);
        this.drawTracker(ctx, true);
    }

    private drawPlanArea(ctx: CanvasRenderingContext2D): void {
        DrawableUtil.setDashStyle(ctx, this.boundary.borderDashStyle);
        ctx.strokeStyle = this.getBorderColor().toRGBA();
        ctx.fillStyle = this.getBackColor().toRGBA();
        ctx.lineWidth = this.boundary.lineThick;
        const bounds = this.getBounds();
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        DrawableUtil.setDashStyle(ctx, DashStyles.Solid);
        ctx.lineWidth = 1;
    }

    private drawPlanText(ctx: CanvasRenderingContext2D): void {
        if (this.boundary.boundaryText.text.length > 0) {
            if (this.boundary.drawTextDirection === DrawTextDirection.Normal) {
                const textBoundary = new DrawText("TextBoundary");
                textBoundary.setLocation(new Point(this._currentLocation.x + this.boundary.leftMargin
                    , this._currentLocation.y + this.boundary.topMargin));
                
                textBoundary.attribute.fontName = "tahoma";
                textBoundary.attribute.fontSize = this.boundary.boundaryText.fontSize;
                textBoundary.wrappedText = this.boundary.wrappedText;
                textBoundary.attribute.textAlign = this.boundary.textAlign;
                textBoundary.attribute.fontStyle = (this.boundary.boundaryText.bold) ? FontStyles.bold : FontStyles.normal;
                textBoundary.text = this.boundary.boundaryText.text;
                textBoundary.setSize(new Size(this.getSize().width, this.getSize().height));
                textBoundary.attribute.lineColor = this.boundary.boundaryText.textColor;
                textBoundary.draw(ctx);
            } else {
                const textBoundary = new DrawVerticalText("VerticalTextBoundary");
                textBoundary.setLocation(new Point(this._currentLocation.x + this.boundary.leftMargin
                    , this._currentLocation.y + this.boundary.topMargin));
                
                textBoundary.drawTextDirection = this.boundary.drawTextDirection;
                textBoundary.attribute.fontName = "tahoma";
                textBoundary.attribute.fontSize = this.boundary.boundaryText.fontSize;
                textBoundary.wrappedText = this.boundary.wrappedText;
                textBoundary.attribute.textAlign = this.boundary.textAlign;
                textBoundary.attribute.fontStyle = (this.boundary.boundaryText.bold) ? FontStyles.bold : FontStyles.normal;
                textBoundary.text = this.boundary.boundaryText.text;
                textBoundary.setSize(new Size(this.getSize().width, this.getSize().height));
                textBoundary.attribute.lineColor = this.boundary.boundaryText.textColor;
                textBoundary.draw(ctx);
            }
        }
    }

    drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void {
        if (!this.isSelected || this.isBackground || !this.boundary.visibleTracker) return;

        const resizeColor = DrawableUtil.getTrackerColor(true);
        const unresizeColor = ColorUtil.getArgbColorOpacity(Color.Blue(), 0.6);

        for (let i = 1; i <= this.HandleCount; i++) {
            if (this.enableResizable) {
                let resizable = true;
                let color = resizeColor;
                if ((this.enableResizeVertex & (1 << (i - 1))) === 0) {
                    resizable = false;
                    color = unresizeColor;
                }
                DrawableUtil.drawTracker(ctx, resizable, this.enableMove, color, super.getHandleRectangle(i));
            } else {
                if (i % 2 === 0) continue;

                const point = super.getHandle(i);
                const selectBoundary = new Rectangle(point.x, point.y, 1,1);
                selectBoundary.inflate(new Size(1, 1));
                DrawableUtil.drawTracker(ctx, this.enableResizable, this.enableMove, unresizeColor, selectBoundary);
            }
        }
    }

    private getBorderColor(): Color {
        if (this.boundary.borderColor.alpha === 1) {
            return ColorUtil.getArgbColorOpacity(this.boundary.borderColor, 0.7);
        }

        return this.boundary.borderColor;
    }

    private getBackColor(): Color {
        if (this.boundary.customBackColor) {
            return this.boundary.customBackColor;
        }

        if (this.boundary.backColor.alpha === 1) {
            return ColorUtil.getArgbColorOpacity(this.boundary.backColor, 0.7);
        }

        return this.boundary.backColor;
    }

    pointInObject(point: Point): boolean {
        let degree = this.degree;
        let rotationCenter = this.rotationCenter;

        if (this.parentGeometry && this.parentGeometry.degree !== 0) {
            degree = this.parentGeometry.degree;
            rotationCenter = this.parentGeometry.rotationCenter;
        }

        if (degree !== 0) {
            return DrawableUtil.isContainPoint(
                 DrawableUtil.transformPoints(DrawableUtil.getVertex(this.getBounds()), degree
                 , rotationCenter)
                 , point.x, point.y);
        } else {
            return this.getBounds().containsPoint(point);
        }
    }

    intersectsWith(rect: Rectangle): boolean {
        let degree = this.degree;
        let rotationCenter = this.rotationCenter;

        if (this.parentGeometry && this.parentGeometry.degree !== 0) {
            degree = this.parentGeometry.degree;
            rotationCenter = this.parentGeometry.rotationCenter;
        }

        let pointArray = DrawableUtil.getVertex(this.getBounds());
        if (degree !== 0) {
            pointArray = DrawableUtil.transformPoints(pointArray, degree
            , rotationCenter);
        }

        if (DrawableUtil.isContainRectangle(pointArray, rect)) {
            return true;
        }

        return false;
    }    

    getDragData(): any {
        return this;
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        event.button
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

class TBoundaryProperty {
    selectableBoundaryMode?: BoundaryMode;
}

export default TBoundary;
export { TBoundaryProperty };