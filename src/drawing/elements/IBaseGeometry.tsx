import BaseDrawableObject from './BaseDrawableObject';
import * as structures from '../structures';

interface IBaseGeometry {
    name: string;
    visible: boolean;    
    attribute: structures.GeometryAttribute;
    anchor: structures.AnchorStyles;
    degree: number;
    isChanged: boolean;
    isForceDraw: boolean;
    parentGeometry: BaseDrawableObject;
    frozenTypes: structures.FrozenTypes;
    drawingDirection: structures.DrawingDirection;
    baseLocation: structures.Point;
    frozenLineIndex: number;
    getLocation(): structures.Point;
    getSize(): structures.Size;
    getCurrentLocation(): structures.Point;
    getCurrentSize(): structures.Size;
    setLocation(point: structures.Point): void;
    setSize(size: structures.Size): void;
    setCurrentLocation(point: structures.Point): void;
    setCurrentSize(size: structures.Size): void;
    objectInCanvas(m_Scalef: number, canvasRectangle: structures.Rectangle): boolean;
    getMBR(): structures.Rectangle;
    getDisplayedLocation(): structures.Point;
    applyBaseLocation(baseLocation: structures.Point, drawingDir: structures.DrawingDirection): void;
    draw(ctx: any): void;
}

export default IBaseGeometry;