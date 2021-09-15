import React, {useState , RefObject} from 'react';
import BaseDrawArea from '../../drawing/BaseDrawArea';
import DrawArea from '../../drawing/DrawArea';
import DrawUserComponent from '../../drawing/DrawUserComponent';
import QCSideCabinItem from './drawcontainer/quaycrane/items/QCSideCabinItem';
import QCSideContainerItem from './drawcontainer/quaycrane/items/QCSideContainerItem';
import QCSideItem from './drawcontainer/quaycrane/items/QCSideItem';
import QCSideMachineryHouseItem from './drawcontainer/quaycrane/items/QCSideMachineryHouseItem';
import QCSideSpreaderItem from './drawcontainer/quaycrane/items/QCSideSpreaderItem';
import QCSideTrolleyItem from './drawcontainer/quaycrane/items/QCSideTrolleyItem';
import TrolleyJobTypes from './drawcontainer/quaycrane/structures/TrolleyJobTypes';
import TCrane from './drawcontainer/quaycrane/TCrane';
import DrawText from '../../drawing/elements/DrawText';
import GeometryPolygon from '../../drawing/elements/GeometryPolygon';
import DrawCanvasEventArgs from '../../drawing/events/DrawCanvasEventArgs';
import TextBoxItem from '../../drawing/items/TextBoxItem';
import { Color, LineAlignment, Point, Size } from '../../drawing/structures';
import ArrangeDirection from '../../drawing/structures/ArrangeDirection';
import GeometryRectangle from '../../drawing/elements/GeometryRectangle';
import { Guid } from 'guid-typescript';
import GeometryTriangle from '../../drawing/elements/GeometryTriangle';
import GeometryEllipse from '../../drawing/elements/GeometryEllipse';
import DrawTriangle from '../../drawing/elements/DrawTriangle';
import DrawRectangle from '../../drawing/elements/DrawRectangle';
import DrawPolygon from '../../drawing/elements/DrawPolygon';
import GeneralLogger from '../../logger/GeneralLogger';

class QuayCrane extends DrawUserComponent {    
    state = {
        x: '0',
        y: '0',
        rotate: '0'
    }

    private _drawAreaRef: RefObject<DrawArea>;
    //private _drawAreaRef2: RefObject<DrawArea>;
    
    static defaultProps = {
        name: ''
    }

    zoomRatio = 1;
    craneVerticalMargin = 0;
    arrangeTopMargin = 10;

    constructor(props: any){
        super(props);
        GeneralLogger.debug(props.name);
        this._drawAreaRef = React.createRef();
        //this._drawAreaRef2 = React.createRef();
    }

    handler(drawArea: BaseDrawArea, args: DrawCanvasEventArgs): void {
        GeneralLogger.debug(args.selectionList);
    }

    componentDidMount() {
        const drawArea = this._drawAreaRef.current;

        if (drawArea) {
            super.setDrawArea(drawArea);
            drawArea.setWidth(1500);
            drawArea.setHeight(1500);
            drawArea.isDrawableObjectResize = true;
            drawArea.isDrawableObjectMove = true;
            drawArea.isDrawableObjectMouseOver = true;
            drawArea.setArrangeDirection(ArrangeDirection.None);
            drawArea.arrangeFixCount = 2;
            
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
            //drawArea.addDrawableObject(crane);

            qcItem.name = "QC02";
            const crane2 = new TCrane(qcItem);
            crane2.attribute.outLineColor = Color.Red();
            crane2.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane2.setLocation(new Point(100, 100));
            crane2.updateMBR();
            crane2.enableResizable = true;
            crane2.enableMouseOver = true;
            //drawArea.addDrawableObject(crane2);

            qcItem.name = "QC02";
            const crane3 = new TCrane(qcItem);
            crane3.attribute.outLineColor = Color.Red();
            crane3.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane3.setLocation(new Point(100, 100));
            crane3.updateMBR();
            crane3.enableResizable = true;
            crane3.enableMouseOver = true;
            //drawArea2.addDrawableObject(crane3);

            // const points: Point[] = [];
            // points.push(new Point(50, 50));
            // points.push(new Point(150, 0));
            // points.push(new Point(250, 50));
            // points.push(new Point(200, 100));
            // points.push(new Point(100, 100));
            // const drawPolygon = new DrawPolygon("name", points);
            // drawPolygon.attribute.radiusEdge = true;
            // drawPolygon.attribute.lineThick = 20;
            // drawPolygon.attribute.lineAlign = LineAlignment.Inset;
            // drawPolygon.attribute.fillColor = Color.Green();
            // crane2.addGeomObject(drawPolygon);

            const geomRec = new GeometryEllipse("name", 50, 50, 100, 100);
            geomRec.attribute.lineThick = 10;
            geomRec.attribute.lineAlign = LineAlignment.Inset;
            geomRec.attribute.fillColor = Color.Green();
            geomRec.enableResizable = true;
            drawArea.addDrawableObject(geomRec);

            const geomTri = new GeometryTriangle("name1", 150, 150, 100, 100);
            geomTri.attribute.radiusEdge = true;
            geomTri.attribute.lineThick = 10;
            geomTri.attribute.lineAlign = LineAlignment.Center;
            geomTri.attribute.fillColor = Color.Green();
            geomTri.enableResizable = true;
            drawArea.addDrawableObject(geomTri);

            // const drawTri = new DrawRectangle("name2");
            // drawTri.setLocation(new Point(200, 200));
            // drawTri.setSize(new Size(200, 200));
            // drawTri.attribute.radiusEdge = true;
            // drawTri.attribute.lineThick = 10;
            // drawTri.attribute.lineAlign = LineAlignment.Center;
            // drawTri.attribute.fillColor = Color.Green();
            // crane2.addGeomObject(drawTri);
            // drawArea.setPageScale(2);
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
        geomRectangle.attribute.fillColor = Color.Blue();
        geomRectangle.attribute.lineThick = 10;
        geomRectangle.attribute.lineAlign = LineAlignment.Outset;
        super.getDrawArea().addDrawableObject(geomRectangle);
    }

    onAddPolygonClick(e: any): void {
        const geomPolygon = new GeometryPolygon("polygon" + Guid.create(), [new Point(0, 50), new Point(50, 0), new Point(100, 50), new Point(80, 100), new Point(20, 100)])
        geomPolygon.enableResizable = true;
        geomPolygon.rotate(parseInt(this.state.rotate.toString()));
        geomPolygon.movePoint(new Point(parseInt(this.state.x.toString()), parseInt(this.state.y.toString())));
        geomPolygon.attribute.fillColor = Color.Blue();
        geomPolygon.attribute.lineThick = 10;
        geomPolygon.attribute.lineAlign = LineAlignment.Center;
        super.getDrawArea().addDrawableObject(geomPolygon);
    }

    render() {
        return (
            <div id='parent' style={{
                maxHeight:'512px',
                maxWidth:'512px',
                overflow:'auto'
                }}>
                X: <input id="inputX" onChange={this.onInputXChange.bind(this)} style={{width: '50px'}}/>&nbsp;
                Y: <input id="inputY" onChange={this.onInputYChange.bind(this)} style={{width: '50px'}}/>&nbsp;
                Rotate: <input id="inputRotate" onChange={this.onInputRotateChange.bind(this)} style={{width: '50px'}}/><br/>
                <button id="addRec" onClick={this.onAddRectangleClick.bind(this)}>Add Rectangle</button>&nbsp;
                <button id="addPolygon" onClick={this.onAddPolygonClick.bind(this)}>Add Polygon</button><br/>
                
                <DrawArea ref={this._drawAreaRef} />
                {/* <DrawArea ref={this._drawAreaRef2} /> */}
            </div>
        );
    }
}

const QCSide = ({match}: any) => {
    //GeneralLogger.debug(match);
    return (
        <div>
            <QuayCrane name = 'hi, it`s qcside page'/>
        </div>
    )
}

export default QCSide;