import { Guid } from "guid-typescript";
import React from "react";
import { RefObject } from "react";
import DrawUserComponent from "../../drawing/DrawUserComponent";
import GeometryPolygon from "../../drawing/elements/GeometryPolygon";
import GeometryRectangle from "../../drawing/elements/GeometryRectangle";
import LayerDrawArea from "../../drawing/LayerDrawArea";
import { Color, DisplayLayer, LineAlignment, Point } from "../../drawing/structures";
import ArrangeDirection from "../../drawing/structures/ArrangeDirection";
import SnowMan from "./SnowMan";

class LayerView extends DrawUserComponent{
    private _drawAreaRef: RefObject<LayerDrawArea>;

    constructor(props: any){
        super(props);
        this._drawAreaRef = React.createRef();
    }

    componentDidMount() {
        const drawArea = this._drawAreaRef.current;

        if (drawArea) {
            super.setDrawArea(drawArea);
            drawArea.setWidth(1500);
            drawArea.setHeight(1500);
            drawArea.setArrangeDirection(ArrangeDirection.None);

            const geomRectangle = new GeometryRectangle("rectangle" + Guid.create(), 0, 0, 200, 200);
            geomRectangle.setLocation(new Point(100, 100));
            geomRectangle.enableResizable = true;
            geomRectangle.attribute.fillColor = Color.Blue();
            geomRectangle.attribute.lineThick = 10;
            drawArea.addToLayer(geomRectangle, DisplayLayer.One);

            const geomPolygon = new GeometryPolygon("polygon" + Guid.create(), [new Point(0, 50), new Point(50, 0), new Point(100, 50), new Point(80, 100), new Point(20, 100)])
            geomPolygon.enableResizable = true;
            geomPolygon.attribute.fillColor = Color.Red();
            geomPolygon.attribute.lineThick = 10;
            drawArea.addToLayer(geomPolygon, DisplayLayer.Two);

            const snowMan = new SnowMan("snowMan", 100, DisplayLayer.Three);
            snowMan.setLocation(new Point(500, 100));
            snowMan.updateMBR();
            const list = snowMan.getGeomListLayer(DisplayLayer.One);
            list.forEach(element => {
                element.visible = !element.visible;
            });
            drawArea.addToLayer(snowMan, DisplayLayer.Three);
            drawArea.refresh();
        }
    }

    onSwapLayer(e: any): void {
        const list = (this.getDrawArea() as LayerDrawArea).getDrawListInLayer(DisplayLayer.Three);
        list.forEach(element => {
            element.visible = !element.visible;
        });
    }

    render() {
        return (
            <div id='parent' style={{
                maxHeight:'1500px',
                maxWidth:'1500px',
                overflow:'auto'
                }}>
                Level: <input id="level" style={{width: '50px'}}/>&nbsp;
                <button id="onSwap" onClick={this.onSwapLayer.bind(this)}>Switch Layer</button><br/>
                
                <LayerDrawArea ref={this._drawAreaRef} />
                {/* <DrawArea ref={this._drawAreaRef2} /> */}
            </div>
        );
    }
}

export default LayerView;