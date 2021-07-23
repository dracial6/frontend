import React, {useState , RefObject} from 'react';
import BaseDrawArea from '../../drawing/BaseDrawArea';
import DrawArea from '../../drawing/DrawArea';
import DrawUserComponent from '../../drawing/DrawUserComponent';
import QCSideCabinItem from '../../drawing/drawcontainer/quaycrane/items/QCSideCabinItem';
import QCSideContainerItem from '../../drawing/drawcontainer/quaycrane/items/QCSideContainerItem';
import QCSideItem from '../../drawing/drawcontainer/quaycrane/items/QCSideItem';
import QCSideMachineryHouseItem from '../../drawing/drawcontainer/quaycrane/items/QCSideMachineryHouseItem';
import QCSideSpreaderItem from '../../drawing/drawcontainer/quaycrane/items/QCSideSpreaderItem';
import QCSideTrolleyItem from '../../drawing/drawcontainer/quaycrane/items/QCSideTrolleyItem';
import TrolleyJobTypes from '../../drawing/drawcontainer/quaycrane/structures/TrolleyJobTypes';
import TCrane from '../../drawing/drawcontainer/quaycrane/TCrane';
import DrawText from '../../drawing/elements/DrawText';
import GeometryPolygon from '../../drawing/elements/GeometryPolygon';
import DrawCanvasEventArgs from '../../drawing/events/DrawCanvasEventArgs';
import TextBoxItem from '../../drawing/items/TextBoxItem';
import { Color, DrawingDirection, Point } from '../../drawing/structures';
import ArrangeDirection from '../../drawing/structures/ArrangeDirection';
import EmptyContainer from './EmptyContainer';
import GeometryRectangle from '../../drawing/elements/GeometryRectangle';
import { Guid } from 'guid-typescript';

class QuayCrane extends DrawUserComponent {    
    state = {
        x: '0',
        y: '0',
        rotate: '0'
    }

    private _drawAreaRef: RefObject<DrawArea>;
    private _drawAreaRef2: RefObject<DrawArea>;
    
    static defaultProps = {
        name: ''
    }

    zoomRatio = 1;
    craneVerticalMargin = 0;
    arrangeTopMargin = 10;

    constructor(props: any){
        super(props);
        console.log(props.name);
        this._drawAreaRef = React.createRef();
        this._drawAreaRef2 = React.createRef();
    }

    handler(drawArea: BaseDrawArea, args: DrawCanvasEventArgs): void {
        console.log(args.selectionList);
    }

    componentDidMount() {
        const drawArea = this._drawAreaRef.current;
        const drawArea2 = this._drawAreaRef2.current;
        if (drawArea && drawArea2) {
            super.setDrawArea(drawArea);
            drawArea.setWidth(1500);
            drawArea.setHeight(1500);
            drawArea.isDrawableObjectResize = true;
            drawArea.isDrawableObjectMove = true;
            drawArea.isDrawableObjectMouseOver = true;
            drawArea.setArrangeDirection(ArrangeDirection.None);
            drawArea.arrangeFixCount = 2;
            
            drawArea2.isDrawableObjectResize = true;
            drawArea2.isDrawableObjectMove = true;
            drawArea2.isDrawableObjectMouseOver = true;
            drawArea2.setArrangeDirection(ArrangeDirection.None);
            drawArea2.drawableObjectClick.addEvent(this.handler.bind(this));
            
            const qcItem = new QCSideItem("QC01");
            qcItem.backColor = Color.Green();
            qcItem.borderColor = Color.Black();
            qcItem.nameStyle = new TextBoxItem();
            qcItem.nameStyle.borderColor = Color.Black();
            qcItem.nameStyle.backColor = Color.Transparent();
            qcItem.nameStyle.fontSize = 20;
            qcItem.poleHeight = 75;
            qcItem.outReach = 200;
            qcItem.outReachMargin = 35;
            qcItem.backReach = 150;
            qcItem.backReachMargin = 25;
            qcItem.craneHeight = 150;
            qcItem.liftTopHeight = 125;
            qcItem.liftBottomDepth = 50;
            qcItem.railSpan = 100;
            qcItem.clearanceHeight = 50;
            qcItem.craneThick = 3;
            qcItem.titlePos = new Point(50, 50);

            const machineryHouse = new QCSideMachineryHouseItem();
            machineryHouse.width = 25;
            machineryHouse.height = 15;
            machineryHouse.backColor = Color.LightGray();
            machineryHouse.borderColor = Color.Black();

            qcItem.machineryHouse = machineryHouse;

            const trolleyItem = new QCSideTrolleyItem();
            trolleyItem.jobType = TrolleyJobTypes.Main;

            const cabinItem = new QCSideCabinItem();
            cabinItem.width = 22;
            cabinItem.height = 10;
            cabinItem.backColor = Color.Green();
            cabinItem.borderColor = Color.Black();

            trolleyItem.cabin = cabinItem;

            trolleyItem.spreader = [];

            const cntrItem = new QCSideContainerItem();
            cntrItem.backColor = Color.Blue();
            cntrItem.borderColor = Color.Black();
            cntrItem.width = 10;
            cntrItem.height = 10;

            // Waterside Spreader
            const spreaderW = new QCSideSpreaderItem();
            spreaderW.width = 10;
            spreaderW.height = 5;
            spreaderW.backColor = Color.Green();
            spreaderW.borderColor = Color.Black();
            spreaderW.hoistPosition = 30;
            spreaderW.container = cntrItem;

            trolleyItem.spreader.push(spreaderW);

            // Landside Spreader
            const spreaderL = new QCSideSpreaderItem();
            spreaderL.width = 10;
            spreaderL.height = 5;
            spreaderL.backColor = Color.Green();
            spreaderL.borderColor = Color.Black();
            spreaderL.hoistPosition = 80;
            spreaderL.lockStatus = false;

            trolleyItem.spreader.push(spreaderL);
            qcItem.trolley.push(trolleyItem);

            const crane = new TCrane(qcItem);
            crane.attribute.outLineColor = Color.Red();
            crane.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane.setLocation(new Point(100, 1000));
            crane.rotate(15);
            crane.updateMBR();
            crane.enableResizable = true;
            crane.enableMouseOver = true;
            drawArea.addDrawableObject(crane);

            qcItem.name = "QC02";
            const crane2 = new TCrane(qcItem);
            crane2.attribute.outLineColor = Color.Red();
            crane2.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane2.setLocation(new Point(100, 100));
            crane2.updateMBR();
            crane2.enableResizable = true;
            crane2.enableMouseOver = true;
            drawArea.addDrawableObject(crane2);

            qcItem.name = "QC02";
            const crane3 = new TCrane(qcItem);
            crane3.attribute.outLineColor = Color.Red();
            crane3.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane3.setLocation(new Point(100, 100));
            crane3.updateMBR();
            crane3.enableResizable = true;
            crane3.enableMouseOver = true;
            drawArea2.addDrawableObject(crane3);

            const text = new DrawText("text");
            text.attribute.fontSize = 40;
            text.attribute.isOutLine = true;
            text.attribute.outLineColor = Color.Red();
            text.attribute.textOutLineColor = Color.Red();
            text.attribute.textOutLineThick = 1;
            text.text = "QC01";

            const container = new EmptyContainer("container");
            container.addGeomObject(text);
            container.updateMBR();
            //canvas.addDrawableObject(container);
        }
    }

    onInputXChange(e: any): void {
        if (e.target.value) this.setState({ x: e.target.value });
    }

    onInputYChange(e: any): void {
        if (e.target.value) this.setState({ y: e.target.value });
    }

    onInputRotateChange(e: any): void {
        if (e.target.value) this.setState({ rotate: e.target.value });
    }

    onAddRectangleClick(e: any): void {
        const geomRectangle = new GeometryRectangle("rectangle" + Guid.create(), 0, 0, 100, 100);
        geomRectangle.setLocation(new Point(parseInt(this.state.x.toString()), parseInt(this.state.y.toString())));
        geomRectangle.enableResizable = true;
        geomRectangle.rotate(parseInt(this.state.rotate.toString()));
        super.getDrawArea().addDrawableObject(geomRectangle);
    }

    onAddPolygonClick(e: any): void {
        const geomPolygon = new GeometryPolygon("polygon" + Guid.create(), [new Point(0, 50), new Point(50, 0), new Point(100, 50), new Point(80, 100), new Point(20, 100)])
        geomPolygon.enableResizable = true;
        geomPolygon.rotate(parseInt(this.state.rotate.toString()));
        geomPolygon.movePoint(new Point(parseInt(this.state.x.toString()), parseInt(this.state.y.toString())));
        super.getDrawArea().addDrawableObject(geomPolygon);
    }

    render() {
        return (
            <div>
                X: <input type="inputX" onChange={this.onInputXChange.bind(this)} style={{width: '50px'}}/>&nbsp;
                Y: <input type="inputY" onChange={this.onInputYChange.bind(this)} style={{width: '50px'}}/>&nbsp;
                Rotate: <input type="inputRotate" onChange={this.onInputRotateChange.bind(this)} style={{width: '50px'}}/><br/>
                <button id="addRec" onClick={this.onAddRectangleClick.bind(this)}>Add Rectangle</button>&nbsp;
                <button id="addPolygon" onClick={this.onAddPolygonClick.bind(this)}>Add Polygon</button><br/>
                <DrawArea ref={this._drawAreaRef} />
                <DrawArea ref={this._drawAreaRef2} />
            </div>
        );
    }
}

const QCSide = ({match}: any) => {
    //console.log(match);
    return (
        <div>
            <QuayCrane name = 'hi, it`s qcside page'/>
        </div>
    )
}

export default QCSide;