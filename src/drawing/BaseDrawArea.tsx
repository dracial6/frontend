import React, { RefObject } from 'react';
import { TEvent } from '../common';
import MouseButtons from '../common/structures/MouseButtons';
import GeneralLogger from '../logger/GeneralLogger';
import FontUtil from '../utils/FontUtil';
import SearchUtil from '../utils/SearchUtil';
import BaseDrawableList from './BaseDrawableList';
import DrawAreaStatus from './DrawAreaStatus';
import DrawArrangeHandler from './DrawArrangeHandler';
import BaseDrawableObject from './elements/BaseDrawableObject';
import GeometryRectangle from './elements/GeometryRectangle';
import GeometryText from './elements/GeometryText';
import IBaseGeometry from './elements/IBaseGeometry';
import IDrawableGeometry from './elements/IDrawableGeometry';
import IGeometryToolTip from './elements/IGeometryToolTip';
import DrawCanvasEvent from './events/DrawCanvasEvent';
import DrawCanvasEventArgs from './events/DrawCanvasEventArgs';
import DrawDragEvent from './events/DrawDragEvent';
import DrawDragEventArgs from './events/DrawDragEventArgs';
import DrawableEventManager from './events/handler/DrawableEventManager';
import { Color, Cursors, DashStyles, DrawAreaViewState, DrawControlEventType, DrawingDirection, FontStyles, Point, Rectangle, Size, ZoomType } from './structures';
import ArrangeDirection from './structures/ArrangeDirection';

type PreprocessPaintMethodDelegate = () => void;

class PreprocessPaintMethodHandler extends TEvent {
    protected events: PreprocessPaintMethodDelegate[] = [];

    addEvent(eventHandler: PreprocessPaintMethodDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: PreprocessPaintMethodDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(): void {
        this.events.forEach(eventHandler => {
            eventHandler();
        });
    }
}

abstract class BaseDrawArea extends React.Component {
    protected _autoSelectionToFront = true;
    private _canvasContext!: CanvasRenderingContext2D;
    private static _staticCanvasContext: CanvasRenderingContext2D | undefined;
    private _canvasRef: RefObject<HTMLCanvasElement>;
    private _rAF = 0;
    private _pageScale = 1;
    private _zoomMaximum = 3;
    private _zoomMinimum = 0.3;
    private _drawArrangeHandler: DrawArrangeHandler;
    private _viewStatus = DrawAreaViewState.CONTROL;
    private _enableViewStatusChange = false;
    private _currentMouseButton = -1;
    private _dragRec?: GeometryRectangle;
    private _mouseDownPos = Point.empty();
    private _drawableEventManager: DrawableEventManager;
    private _state = new DrawAreaStatus();
    private _arrangeDirection = ArrangeDirection.None;
    private _allowDragAtDrawControl = false;
    private _tooltipGeomText: GeometryText;
    private _parentTagElement! : HTMLElement;

    isDrawableObjectSelect = false;
    isDrawableObjectDragSelect = false;
    isChildDrawableObjectSelect = false;
    isDrawableObjectResize = false;
    isDrawableObjectMove = false;
    isDrawableMemoryCache = false;
    isDrawableObjectMouseOver = false;
    arrangeLeftMargin = 1;
    rightExtendsionMargin = 0;
    arrangeTopMargin = 1;
    arrangeFixCount = 0;
    isChanged = false;
    enableMouseRightButton = false;
    visibleMouseDragLine = true;
    mouseX = 0;
    mouseY = 0;
    zoomLargeChange = 0.5;

    preprocessPaintMethodHandler = new PreprocessPaintMethodHandler();

    private readonly tooltipName = 'ToolTip';
    readonly drawableObjectClick = new DrawCanvasEvent();
    readonly drawableObjectDoubleClick = new DrawCanvasEvent();
    readonly drawableObjectDragSelect = new DrawCanvasEvent();
    readonly drawableObjectMove = new DrawCanvasEvent();
    readonly drawableObjectResize = new DrawCanvasEvent();
    readonly drawableObjectResizeBegin = new DrawCanvasEvent();
    readonly drawableObjectResizeEnd = new DrawCanvasEvent();
    readonly drawableObjectMoveBegin = new DrawCanvasEvent();
    readonly drawableObjectMoveEnd = new DrawCanvasEvent();
    readonly drawableObjectDrag = new DrawDragEvent();

    static IsCtrlKeyPressed = false;

    constructor(props: any) {
        super(props);
        this.setPageScale(1);
        this._tooltipGeomText = new GeometryText(this.tooltipName, 0, 0, '');
        this._tooltipGeomText.enableMouseOver = false;
        this._tooltipGeomText.attribute.isOutLine = true;
        this._tooltipGeomText.attribute.outLineColor = Color.Black();
        this._tooltipGeomText.attribute.fillColor = Color.White();
        this._tooltipGeomText.attribute.fontSize = 20;
        this._tooltipGeomText.visible = false;
        this._drawableEventManager = new DrawableEventManager(this._state);
        this._drawArrangeHandler = new DrawArrangeHandler(this, this.arrangeTopMargin, this.arrangeLeftMargin);        

        this._canvasRef = React.createRef();
        this.updateAnimationState = this.updateAnimationState.bind(this);
        
        window.onkeydown = this.onKeyDown;
        window.onkeyup = this.onKeyUp;
    }

    static getContext(): CanvasRenderingContext2D | undefined {
        return BaseDrawArea._staticCanvasContext;
    }

    getState(): DrawAreaStatus {
        return this._state;
    }

    getArrangeDirection(): ArrangeDirection {
        return this._arrangeDirection;
    }

    setArrangeDirection(arrangeDirection: ArrangeDirection): void {
        this._arrangeDirection = arrangeDirection;
        if (this._arrangeDirection !== ArrangeDirection.None) {
            this.isDrawableObjectMove = false;
            this.isDrawableObjectResize = false;
        }
    }

    getAllowDragAtDrawControl(): boolean {
        return this._allowDragAtDrawControl;
    }

    setAllowDragAtDrawControl(allowDragAtDrawControl: boolean): void {
        this._allowDragAtDrawControl = allowDragAtDrawControl;
        if (allowDragAtDrawControl) {
            this.isDrawableObjectMove = false;
        }
    }

    getDrawArrangeHandler(): DrawArrangeHandler {
        return this._drawArrangeHandler;
    }

    setViewStatus(state: DrawAreaViewState): void {
        this._viewStatus = state;
        this.setDefaultCursor();
    }

    private setDefaultCursor(): void {
        if (!this._canvasContext) return;

        if (this._viewStatus === DrawAreaViewState.CONTROL) {
            this._canvasContext.canvas.style.cursor = Cursors[Cursors.default];
        } else {
            this._canvasContext.canvas.style.cursor = Cursors[Cursors.move];
        }
    }

    getCurrentMouseButton(): number {
        return this._currentMouseButton;
    }

    getCursor(): string {
        return this._canvasContext.canvas.style.cursor;
    }

    setCursor(cursor: Cursors): void {
        this._canvasContext.canvas.style.cursor = Cursors[cursor].replace('_', '-');
    }

    setEnableViewStatusChange(enable: boolean): void {
        this._enableViewStatusChange = enable;
        
        if (!enable) {
            this.setViewStatus(DrawAreaViewState.CONTROL);
        }
    }

    getWidth(): number {
        if (!this._canvasContext) return 0;

        return this._canvasContext.canvas.width;
    }

    setWidth(width: number): void {
        if (!this._canvasContext) return;

        this._canvasContext.canvas.width = width;
        
    }
    getHeight(): number {
        if (!this._canvasContext) return 0;

        return this._canvasContext.canvas.height;
    }

    setHeight(height: number): void {
        if (!height) return;

        this._canvasContext.canvas.height = height;
    }

    getScrollX(): number {
        return this._parentTagElement.scrollLeft;
    }

    setScrollX(x: number): void {
        this._parentTagElement.scrollLeft = x;
    }

    getScrollY(): number {
        return this._parentTagElement.scrollTop;
    }

    setScrollY(x: number): void {
        this._parentTagElement.scrollTop = x;
    }

    getOffsetX(): number {
        if (!this._canvasContext) return 0;

        return this._canvasContext.canvas.offsetLeft;
    }

    getOffsetY(): number {
        if (!this._canvasContext) return 0;

        return this._canvasContext.canvas.offsetTop;
    }

    getAutoSelectionToFront(): boolean {
        return this._autoSelectionToFront;
    }

    getComponentStyle(): CSSStyleDeclaration {
        return this._canvasContext.canvas.style;
    }

    setAutoSelectionToFront(autoSelectionToFront: boolean): void {
        this._autoSelectionToFront = autoSelectionToFront;
        this.getDefaultDrawList().isBringToTop = autoSelectionToFront;
    }

    componentDidMount() {
        this.addDrawableObject(this._tooltipGeomText);

        const canvas = this._canvasRef.current;
        if (canvas) {
            this._parentTagElement = document.getElementById('parent') as HTMLElement;
            canvas.addEventListener('click', this.onMouseClick.bind(this), false);
            canvas.addEventListener('dblclick', this.onMouseDoubleClick.bind(this), false);
            canvas.onmousemove = this.onMouseMove.bind(this);
            canvas.onmousedown = this.onMouseDown.bind(this);
            canvas.onmouseup = this.onMouseUp.bind(this);
            canvas.onmouseleave = this.onMouseLeave.bind(this);
            canvas.width = 500;
            canvas.height = 500;
            canvas.style.border = "1px solid #000";
            this._canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
            BaseDrawArea._staticCanvasContext = this._canvasContext;
            if (this._canvasContext) {       
                this.updateAnimationState();
                if (this._canvasContext && this._canvasContext instanceof CanvasRenderingContext2D) this.paint();
            }
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this._rAF);
    }

    updateAnimationState() {
        if (this._canvasContext && this._canvasContext instanceof CanvasRenderingContext2D) this.paint();
        this._rAF = requestAnimationFrame(this.updateAnimationState);
    }

    paint(): void {
        if (this.isChanged && this._canvasContext) {
            if (this.preprocessPaintMethodHandler.isEmpty() === false) {
                this.preprocessPaintMethodHandler.doEvent();
            }

            this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

            this.arrangeDrawObject(false);
            this.drawPicture(this._canvasContext);
        }
    }

    protected drawPicture(ctx: CanvasRenderingContext2D): void {
        const matrix = ctx.getTransform();
        matrix.a = this._pageScale;
        matrix.d = this._pageScale;
        ctx.setTransform(matrix);

        this.getDefaultDrawList().viewBoundary = new Rectangle(0, 0, this.getWidth(), this.getHeight());
        this.getDefaultDrawList().draw(ctx, this);
    }

    arrangeDrawObject(enforceArrange: boolean): void {
        if (!this.getDefaultDrawList()) return;
        this.doArrangeDrawObject(this.getDefaultDrawList().getDrawList(), enforceArrange);
    }

    protected doArrangeDrawObject(list: IDrawableGeometry[], enforceArrange: boolean): void {
        if (list.length === 0) return;

        if (this._arrangeDirection !== ArrangeDirection.None) {
            const topLevelGeometry = list[0];
            const topLevelGeometryPoint = topLevelGeometry.getLocation();
            
            this._drawArrangeHandler.arrange(this.getDefaultDrawList().getDrawList(), this._arrangeDirection, this.arrangeFixCount, enforceArrange);

            if (topLevelGeometry && (Point.isEmpty(topLevelGeometry.baseLocation) === false || topLevelGeometry.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom)) {
                if (topLevelGeometryPoint !== topLevelGeometry.getLocation()) {
                    topLevelGeometry.baseLocation = topLevelGeometry.getLocation();
                    this.setBaseLocation(topLevelGeometry, new Point(topLevelGeometryPoint.x, topLevelGeometryPoint.y), topLevelGeometry.drawingDirection);
                }
            }
        }
    }

    setBaseLocation(drawableGeometry: IDrawableGeometry, baseLocation: Point, drawingDir: DrawingDirection): void {
        if (drawableGeometry.baseLocation !== baseLocation || drawableGeometry.drawingDirection !== drawingDir) {
            drawableGeometry.applyBaseLocation(baseLocation, drawingDir);

            if (drawableGeometry.parentGeometry && drawableGeometry instanceof BaseDrawableObject) {
                const obj = drawableGeometry as BaseDrawableObject;
                if (obj.isMemoryCache) {
                    obj.clearMemoryCache();
                }
            }
        }
    }

    addDrawableObject(geomObj: IDrawableGeometry): void {
        this.addDrawableObjectBackground(geomObj, false);
    }

    addDrawableObjectBackground(geomObj: IDrawableGeometry, isBackGround: boolean): void {
        this.addDrawableObjectCheckDuplication(geomObj, isBackGround, true);
    }

    addDrawableObjectCheckDuplication(geomObj: IDrawableGeometry, isBackGround: boolean, checkDuplication: boolean): void {
        geomObj.isBackground = isBackGround;
        this.getDefaultDrawList().addCheckDuplication(geomObj, checkDuplication);
        geomObj.isChanged = true;
        this.isChanged = true;
    }

    clear(): void {
        if (this._canvasContext) this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);
        this.getDefaultDrawList().clear();
    }

    updateDrawableObject(geomObj: IDrawableGeometry): void {
        this.getDefaultDrawList().update(geomObj);
        this._drawArrangeHandler.reset();
        this.isChanged = true;
    }

    removeDrawableObject(geomObj: IDrawableGeometry): void {
        this.getDefaultDrawList().remove(geomObj);
        this._drawArrangeHandler.reset();
        this.isChanged = true;
    }

    removeDrawableObjectByKey(key: string): void {
        this.getDefaultDrawList().removeKey(key);
        this._drawArrangeHandler.reset();
        this.isChanged = true;
    }
    
    refresh(): void {
        if (this._canvasContext) this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

        const drawList = this.getDefaultDrawList().getGeometryList("IDrawableGeometry", true, true);
        
        drawList.forEach(element => {
            element.isChanged = true;
        });
    }

    selectAll(): void {
        this.getDefaultDrawList().selectAll();
        this.refresh();
    }

    unselectAll(): void {
        this.getDefaultDrawList().unSelectAll();
        this.refresh();
    }

    moveSelectionToTop(): void {
        if (this.getDefaultDrawList().moveSelectionToTop()) {
            this.refresh();
        }
    }
    
    moveSelectionToBottom(): void {
        if (this.getDefaultDrawList().moveSelectionToBottom()) {
            this.refresh();
        }
    }

    moveObjToForward(geomObj: IDrawableGeometry): void {
        if (this.getDefaultDrawList().moveObjToForward(geomObj)) {
            this.refresh();
        }
    }

    moveObjsToForward(list: IDrawableGeometry[]): void {
        if (this.getDefaultDrawList().moveObjsToForward(list)) {
            this.refresh();
        }
    }

    moveToTop(key: string): void {
        if (this.getDefaultDrawList().moveToTop(key)) {
            this.refresh();
        }
    }

    moveToBottom(key: string): void {
        if (this.getDefaultDrawList().moveToBottom(key)) {
            this.refresh();
        }
    }

    moveToIndex(key: string, index: number): void {
        if (this.getDefaultDrawList().moveToIndex(key, index)) {
            this.refresh();
        }
    }

    measureText(text: string, familyName: string, emSize: number, style: FontStyles): Size {
        const textMetrics = FontUtil.measureText(text, familyName, emSize, style);

        if (textMetrics) {
            return new Size(textMetrics.width, textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);
        } else {
            return Size.empty();
        }
    }

    findAllByKey(key: string): IBaseGeometry[] {
        return this.getDefaultDrawList().findAllByKey(key);
    }

    findAllAtPoint(pPosX: number, pPosY: number): IDrawableGeometry[] {
        return this.getDefaultDrawList().findAllAtPoint(new Point(pPosX, pPosY));
    }

    findFirst(key: string): IBaseGeometry | undefined {
        return this.getDefaultDrawList().findFirstByKey(key);
    }

    findAtBoundary(boundary: Rectangle, pageScale: number): IDrawableGeometry[] {
        return this.getDefaultDrawList().findAtBoundary(boundary, pageScale);
    }

    findAtPoint(pPosX: number, pPosY: number): IDrawableGeometry[] {
        return this.getDefaultDrawList().findAtPoint(new Point(pPosX, pPosY));
    }

    findDrawableObjects(key: string): IDrawableGeometry[] {
        return this.getDefaultDrawList().findDrawableObjects()
    }

    findSelectedDrawableObjects(): IDrawableGeometry[] {
        return this.getDefaultDrawList().findSelection();
    }

    getPageScale(): number {
        return this._pageScale;
    }

    setPageScale(pageScale: number): void {
        if (pageScale < this._zoomMinimum || pageScale > this._zoomMaximum) return;

        if (this.isDrawableMemoryCache) this.getDefaultDrawList().clearMemoryCache();

        this._pageScale = pageScale;
    }

    getZoomMaximum(): number {
        return this._zoomMaximum;
    }

    setZoomMaximum(pageScale: number): void {
        this._zoomMaximum = pageScale;
    }

    getZoomMinimum(): number {
        return this._zoomMinimum;
    }

    setZoomMinimum(pageScale: number): void {
        if (pageScale < 0.3) this._zoomMinimum = 0.3;
        else this._zoomMinimum = pageScale;
    }    

    eventHandler(type: DrawControlEventType, eventArgs: DrawCanvasEventArgs): void {
        switch (type) {
            case DrawControlEventType.Mouse_Click:
                if (!this.drawableObjectClick.isEmpty()) {
                    this.drawableObjectClick.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DoubleClick:
                if (!this.drawableObjectDoubleClick.isEmpty()) {
                    this.drawableObjectDoubleClick.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragSelect:
                if (this.drawableObjectDragSelect.isEmpty()) {
                    this.drawableObjectDragSelect.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragMove:
                if (this.drawableObjectMove.isEmpty()) {
                    this.drawableObjectMove.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragResize:
                if (this.drawableObjectResize.isEmpty()) {
                    this.drawableObjectResize.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragResizeBegin:
                if (this.drawableObjectResizeBegin.isEmpty()) {
                    this.drawableObjectResizeBegin.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragResizeEnd:
                if (this.drawableObjectResizeEnd.isEmpty()) {
                    this.drawableObjectResizeEnd.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragMoveBegin:
                if (this.drawableObjectMoveBegin.isEmpty()) {
                    this.drawableObjectMoveBegin.doEvent(this, eventArgs);
                }
                break;
            case DrawControlEventType.Mouse_DragMoveEnd:
                if (this.drawableObjectMoveEnd.isEmpty()) {
                    this.drawableObjectMoveEnd.doEvent(this, eventArgs);
                }
                break;
        }
    }

    eventHandlerDrag(type: DrawControlEventType, eventArgs: DrawDragEventArgs): void {
        switch (type) {
            case DrawControlEventType.Mouse_ItemDrag:
                if (this.drawableObjectDrag.isEmpty()) {
                    this.drawableObjectDrag.doEvent(this, eventArgs);
                }
                break;                
        }
    }

    private getViewStatus(): DrawAreaViewState {
        if (this._enableViewStatusChange === false) {
            return DrawAreaViewState.CONTROL;
        }

        return this._viewStatus;
    }

    getScale(zoomType: ZoomType): number {
        let temp_m_Scalef = this.zoomLargeChange;
        let scalef = 1;

        try {
            if (zoomType == ZoomType.PAGE_SCALE_IN || zoomType == ZoomType.PAGE_SCALE_OUT) {
                if (zoomType == ZoomType.PAGE_SCALE_IN) {
                    if (this._pageScale < 0.5) {
                        temp_m_Scalef = 0.1;
                    }

                    scalef = this._pageScale + temp_m_Scalef;
                } else if (zoomType == ZoomType.PAGE_SCALE_OUT) {
                    if (this._pageScale <= 0.5) {
                        temp_m_Scalef = 0.1;
                    }

                    scalef = this._pageScale - temp_m_Scalef;
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
        }

        return scalef;
    }

    zoomInOut(scalef: number): void {
        if (!this._canvasContext) return;
        this._canvasContext.scale(scalef, scalef);
    }

    private getRealMouseEvent(e: MouseEvent): MouseEvent {
        const scrollGapX = (this._pageScale > 1) ? (e.pageX - e.clientX) / this._pageScale : 0;
        const scrollGapY = (this._pageScale > 1) ? (e.pageY - e.clientY) / this._pageScale : 0;
        const mouseEvent = new MouseEvent(e.type);
        if (e.view) mouseEvent.initMouseEvent(e.type, e.cancelBubble, e.cancelBubble, e.view, e.detail, e.screenX, e.screenY, (e.clientX - this.getOffsetX()) / this._pageScale - scrollGapX + this.getScrollX(), (e.clientY - this.getOffsetY()) / this._pageScale - scrollGapY + this.getScrollY(), e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);

        return mouseEvent;
    }

    moveScreenCenter(point: Point): void {
        const posX = point.x * this._pageScale - this.getWidth() / 2;
        const posY = point.y * this._pageScale - this.getHeight() / 2;

        this._parentTagElement.scrollLeft = posX;
        this._parentTagElement.scrollTop = posY;
    }

    getCurrentShownBounds(): Rectangle {
        return new Rectangle(this.getScrollX(), this.getScrollY(), this._parentTagElement.getBoundingClientRect().width, this._parentTagElement.getBoundingClientRect().height);
    }

    getDrawablesCurrentBounds<T extends IDrawableGeometry>(shownBounds: Rectangle, memberName: string): T[] {
        const shownDrawablesByType = this.getDefaultDrawList().findAtBoundary(shownBounds, this._pageScale);
        return SearchUtil.getGeometryListByMember(shownDrawablesByType, memberName) as T[];
    }

    getCurrentMousePoint(): Point {
        return new Point(this.mouseX, this.mouseY);
    }

    isMouseClick(): boolean {
        if (this._currentMouseButton === MouseButtons.Left) return true;
        if (this._currentMouseButton === MouseButtons.Right && this.enableMouseRightButton) return true;

        return false;
    }

    private onKeyDown(e: KeyboardEvent): void {
        BaseDrawArea.IsCtrlKeyPressed = e.ctrlKey;
    }

    private onKeyUp(e: KeyboardEvent): void {
        BaseDrawArea.IsCtrlKeyPressed = e.ctrlKey;
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this._canvasContext) return;
        
        const mouseEvent = this.getRealMouseEvent(e);

        this.mouseX = mouseEvent.pageX;
        this.mouseY = mouseEvent.pageY;

        if (this.getViewStatus() === DrawAreaViewState.NAVIGATE) {
            return;
        }

        if (this.isMouseClick() || mouseEvent.button === MouseButtons.Left) {
            this._drawableEventManager.onMouseMove(this, mouseEvent);
        }

        this.setToolTip();
    }

    onMouseClick(e: MouseEvent) : void {
        if (this.getViewStatus() === DrawAreaViewState.NAVIGATE) return;

        if (this.isMouseClick()) {
            this._drawableEventManager.onMouseClick(this, this.getRealMouseEvent(e));
        }

        this._currentMouseButton = -1;
    }
    
    onMouseDoubleClick(e: MouseEvent) : void {
        if (this.getViewStatus() === DrawAreaViewState.NAVIGATE) return;

        if (this.isMouseClick()) {
            this._drawableEventManager.onSelected(this, this.getRealMouseEvent(e));
        }

        this._currentMouseButton = -1;
    }

    onMouseDown(e: MouseEvent): void {
        this._currentMouseButton = e.button;
        const mouseEvent = this.getRealMouseEvent(e);
        this._mouseDownPos = new Point(mouseEvent.clientX, mouseEvent.clientY);

        if (this.getViewStatus() === DrawAreaViewState.NAVIGATE) {
            return;
        }

        if (this.isMouseClick()) {
            this._drawableEventManager.onMouseDown(this, mouseEvent);
        }

        this.moveToTop(this._tooltipGeomText.name);
    }

    onMouseUp(e: MouseEvent): void {
        if (this._dragRec) {
            this._dragRec.visible = false;
            this._dragRec.isChanged = true;
        }

        this.refresh();

        if (this.getViewStatus() === DrawAreaViewState.CONTROL) {
            if (this._currentMouseButton === MouseButtons.Left && (this.getCursor() === Cursors.not_allowed.toString())) {
                this.setCursor(Cursors.default);
            }

            return;
        }

        if (this.isMouseClick()) {
            this._drawableEventManager.onMouseUp(this, this.getRealMouseEvent(e));
        }
    }

    onMouseLeave(e: MouseEvent): void {
        this._currentMouseButton = -1;

        if (this._dragRec) {
            this._dragRec.visible = false;
            this._dragRec.isChanged = true;
            this.refresh();
        }
    }

    setDragLine(visible: boolean, x: number, y: number): void {
        this.refresh();

        if (!this._dragRec) {
            this._dragRec =  new GeometryRectangle("dragRec", 0, 0, 1, 1);
            this._dragRec.visible = false;
            this._dragRec.attribute.dashStyle = DashStyles.Dot;
            this.addDrawableObject(this._dragRec);
        }

        this._dragRec.visible = visible;
        this._dragRec.setLocation(this._mouseDownPos);
        this._dragRec.setSize(new Size(x - this._mouseDownPos.x, y - this._mouseDownPos.y));
    }

    private setToolTip(): void {
        let obj = this.getState().currentOverObject as any as IGeometryToolTip;

        if (!obj) {
            obj = this.getState().currentResizeObject as any as IGeometryToolTip;
        }

        if (obj) {
            this._tooltipGeomText.text = obj.tooltipText;
            this._tooltipGeomText.setLocation(new Point(this.mouseX + 12, this.mouseY + 20));
            this._tooltipGeomText.visible = true;
            this.moveToTop(this._tooltipGeomText.name);
        } else {
            this._tooltipGeomText.visible = false;
            this._tooltipGeomText.isChanged = true;
        }
    }

    abstract getDefaultDrawList(): BaseDrawableList;

    render() {
        return (
            <div>
                <canvas ref={this._canvasRef} />
            </div>
        );
    }
}

export default BaseDrawArea;