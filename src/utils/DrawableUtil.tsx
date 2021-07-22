import DrawLine from "../drawing/elements/DrawLine";
import DrawPolygon from "../drawing/elements/DrawPolygon";
import GeometryLine from "../drawing/elements/GeometryLine";
import GeometryPolygon from "../drawing/elements/GeometryPolygon";
import IBaseGeometry from "../drawing/elements/IBaseGeometry";
import { Color, DashStyles, DrawingDirection, Point, Rectangle, Size } from "../drawing/structures";

class DrawableUtil {
    static drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean, isMoving: boolean, color: Color, rect: Rectangle): void {
        if (isResize) {
            ctx.fillStyle = color.toRGBA();
            ctx.fillRect(rect.x - 3, rect.y - 3, rect.width, rect.height);
            ctx.strokeRect(rect.x - 3, rect.y - 3, rect.width, rect.height);
        } else {
            ctx.fillStyle = color.toRGBA();
            ctx.beginPath();
            ctx.arc(rect.x, rect.y, rect.width / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        if (!isMoving) {
            ctx.fillStyle = Color.Black().toRGBA();
            ctx.fillRect(rect.x - 3, rect.y - 3, rect.width, rect.height);
        }
    }

    static getTrackerColor(resize: boolean): Color {
        if (resize)
            return Color.Red();
        else
            return Color.DarkGray();
    }

    static getMinPoint(x1: number, y1: number, x2: number, y2: number): Point{
        const arr:Point[] = [];
        arr.push(new Point(x1, y1));
        arr.push(new Point(x2, y2));

        return DrawableUtil.getMinPointArray(arr);
    }

    static getMinPointArray(arr: Point[]): Point {
        let minX = 999999;
        let minY = 999999;
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].x < minX) minX = arr[index].x;
            if (arr[index].y < minY) minY = arr[index].y;
        }

        return new Point(minX, minY);
    }

    static getSize(x1: number, y1: number, x2: number, y2: number): Size{
        const arr:Point[] = [];
        arr.push(new Point(x1, y1));
        arr.push(new Point(x2, y2));

        return DrawableUtil.getSizeArray(arr);
    }

    static getSizeArray(arr: Point[]): Size {
        let minX = 999999;
        let minY = 999999;
        let maxX = 0;
        let maxY = 0;

        for (let index = 0; index < arr.length; index++) {
            if (arr[index].x < minX) minX = arr[index].x;
            if (arr[index].y < minY) minY = arr[index].y;
            if (arr[index].x > maxX) maxX = arr[index].x;
            if (arr[index].y > maxY) maxY = arr[index].y;
        }

        let tempX = maxX - minX;
        let tempY = maxY - minY;

        if (tempX === 0) {
            tempX = 1;
        }

        if (tempY === 0) {
            tempY = 1;
        }

        return new Size(tempX, tempY);
    }

    static rotateRectangle(degree: number, rotationCenter: Point, rectangle: Rectangle): Rectangle {
        if (degree === 0) return rectangle;
        return this.getMBR(this.rotatePointArray(degree, rotationCenter, rectangle));
    }

    static rotatePoint(degree: number, rotationCenter: Point, point: Point): Point {
        if (degree === 0) return point;

        const matrix = new DOMMatrix().translate(rotationCenter.x, rotationCenter.y).rotate(degree).translate(-rotationCenter.x, -rotationCenter.y);
        const result = matrix.transformPoint(new DOMPoint(point.x, point.y));

        return new Point(result.x, result.y);
    }

    static rotatePointArray(degree: number, rotationCenter: Point, rectangle: Rectangle): Point[] {
        const points: Point[] = [];

        points.push(new Point(rectangle.x, rectangle.y));
        points.push(new Point(rectangle.x, rectangle.y + rectangle.height));
        points.push(new Point(rectangle.x + rectangle.width, rectangle.y));
        points.push(new Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height));

        return this.transformPoints(points, degree, rotationCenter);
    }

    static transformPoints(pointArray: Point[], degree: number, rotationCenter: Point): Point[] {
        const resultArray: Point[] = [];
        const matrix = new DOMMatrix().translate(rotationCenter.x, rotationCenter.y).rotate(degree).translate(-rotationCenter.x, -rotationCenter.y);
        
        pointArray.forEach((point) => {
            const domPoint = matrix.transformPoint(new DOMPoint(point.x, point.y));
            resultArray.push(new Point(domPoint.x, domPoint.y));
        });

        return resultArray;
    }

    static getVertex(rectangle: Rectangle): Point[] {
        const resultArray: Point[] = [];
        resultArray.push(new Point(rectangle.x, rectangle.y));
        resultArray.push(new Point(rectangle.x + rectangle.width, rectangle.y));
        resultArray.push(new Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height));
        resultArray.push(new Point(rectangle.x, rectangle.y + rectangle.height));

        return resultArray;
    }

    static getNormalLocationGeometry(geometry: IBaseGeometry): Point {
        return DrawableUtil.getNormalLocationSize(geometry.baseLocation, geometry.getLocation(), geometry.getSize(), geometry.drawingDirection);
    }

    static getNormalLocationSize(baseLocation: Point, location: Point, size: Size, drawingDir: DrawingDirection): Point {
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                return new Point(location.x - baseLocation.x, location.y - baseLocation.y);
            case DrawingDirection.LeftToRightAndBottomToTop:
                return new Point(location.x - baseLocation.x, baseLocation.y - (location.y + size.height));
            case DrawingDirection.RightToLeftAndTopToBottom:
                return new Point(baseLocation.x - (location.x + size.width), location.y - baseLocation.y);
            case DrawingDirection.RightToLeftAndBottomToTop:
                return new Point(baseLocation.x - (location.x + size.width), baseLocation.y - (location.y + size.height));
        }
    }

    static getNormalLocation(baseLocation: Point, location: Point, drawingDir: DrawingDirection): Point {
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                return new Point(location.x - baseLocation.x, location.y - baseLocation.y);
            case DrawingDirection.LeftToRightAndBottomToTop:
                return new Point(location.x - baseLocation.x, baseLocation.y - location.y);
            case DrawingDirection.RightToLeftAndTopToBottom:
                return new Point(baseLocation.x - location.x, location.y - baseLocation.y);
            case DrawingDirection.RightToLeftAndBottomToTop:
                return new Point(baseLocation.x - location.x, baseLocation.y - location.y);
        }
    }

    static getNormalLocationArray(geometry: IBaseGeometry): Point[] {
        const rtnPointList: Point[] = [];
        let geometryPointArray: Point[] = [];

        if (geometry instanceof GeometryPolygon) {
            geometryPointArray = (geometry as GeometryPolygon).getPointArray();
        } else if (geometry instanceof GeometryLine) {
            const line = geometry as GeometryLine;
            geometryPointArray.push(line.getCurrentStartPoint());
            geometryPointArray.push(line.getCurrentEndPoint());
        } else if (geometry instanceof DrawLine) {
            const line = geometry as DrawLine;
            geometryPointArray.push(line.getStartPoint());
            geometryPointArray.push(line.getEndPoint());
        } else if (geometry instanceof DrawPolygon) {
            geometryPointArray = (geometry as DrawPolygon).getPointArray();
        }

        switch (geometry.drawingDirection) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                geometryPointArray.forEach((point) => {
                    rtnPointList.push(new Point(point.x - geometry.baseLocation.x, point.y - geometry.baseLocation.y));
                });
                break;
            case DrawingDirection.LeftToRightAndBottomToTop:
                geometryPointArray.forEach((point) => {
                    rtnPointList.push(new Point(point.x - geometry.baseLocation.x, geometry.baseLocation.y - point.y));
                });
                break;
            case DrawingDirection.RightToLeftAndTopToBottom:
                geometryPointArray.forEach((point) => {
                    rtnPointList.push(new Point(geometry.baseLocation.x - point.x, point.y - geometry.baseLocation.y));
                });
                break;
            case DrawingDirection.RightToLeftAndBottomToTop:
                geometryPointArray.forEach((point) => {
                    rtnPointList.push(new Point(geometry.baseLocation.x - point.x, geometry.baseLocation.y - point.y));
                });
                break;
        }

        return rtnPointList;
    }

    static getBaseLocation(geometry: IBaseGeometry, baseLocation: Point, drawingDir: DrawingDirection): Point {
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                if (geometry.parentGeometry){
                    baseLocation = new Point(0, 0);
                }
                break;
            case DrawingDirection.LeftToRightAndBottomToTop:
                if (geometry.parentGeometry) {
                    baseLocation = new Point(0, geometry.parentGeometry.getSize().height);
                }
                break;
            case DrawingDirection.RightToLeftAndTopToBottom:
                if (geometry.parentGeometry) {
                    baseLocation = new Point(geometry.parentGeometry.getSize().width, 0);
                }
                break;
            case DrawingDirection.RightToLeftAndBottomToTop:
                if (geometry.parentGeometry) {
                    baseLocation = new Point(geometry.parentGeometry.getSize().width, geometry.parentGeometry.getSize().height);
                }
                break;
        }

        return baseLocation;
    }

    static getTransformedLocation(normalLocation: Point, size: Size, baseLocation: Point, drawingDir: DrawingDirection): Point {
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                return new Point(baseLocation.x + normalLocation.x, baseLocation.y + normalLocation.y);
            case DrawingDirection.LeftToRightAndBottomToTop:
                return new Point(baseLocation.x + normalLocation.x, baseLocation.y - normalLocation.y - size.height);
            case DrawingDirection.RightToLeftAndTopToBottom:
                return new Point(baseLocation.x - normalLocation.x - size.width, baseLocation.y + normalLocation.y);
            case DrawingDirection.RightToLeftAndBottomToTop:
                return new Point(baseLocation.x - normalLocation.x - size.width, baseLocation.y - normalLocation.y - size.height);
        }
    }

    static getTransformedLocationArray(normalLocationArray: Point[], baseLocation: Point, drawingDir: DrawingDirection): Point[] {
        const transformedLocationArray: Point[] = [];
        
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                normalLocationArray.forEach((point) => {
                    transformedLocationArray.push(new Point(baseLocation.x + point.y, baseLocation.y + point.y));
                });
                break;
            case DrawingDirection.LeftToRightAndBottomToTop:
                normalLocationArray.forEach((point) => {
                    transformedLocationArray.push(new Point(baseLocation.x + point.y, baseLocation.y - point.y));
                });
                break;
            case DrawingDirection.RightToLeftAndTopToBottom:
                normalLocationArray.forEach((point) => {
                    transformedLocationArray.push(new Point(baseLocation.x - point.y, baseLocation.y + point.y));
                });
                break;
            case DrawingDirection.RightToLeftAndBottomToTop:
                normalLocationArray.forEach((point) => {
                    transformedLocationArray.push(new Point(baseLocation.x - point.y, baseLocation.y - point.y));
                });
                break;
        }

        return transformedLocationArray;
    }

    static getTransformedRotationCenter(normalRotationCenter: Point, baseLocation: Point, drawingDir: DrawingDirection): Point {
        switch (drawingDir) {
            case DrawingDirection.LeftToRightAndTopToBottom:
                return new Point(baseLocation.x + normalRotationCenter.x, baseLocation.y + normalRotationCenter.y);
            case DrawingDirection.LeftToRightAndBottomToTop:
                return new Point(baseLocation.x + normalRotationCenter.x, baseLocation.y - normalRotationCenter.y);
            case DrawingDirection.RightToLeftAndTopToBottom:
                return new Point(baseLocation.x - normalRotationCenter.x, baseLocation.y + normalRotationCenter.y);
            case DrawingDirection.RightToLeftAndBottomToTop:
                return new Point(baseLocation.x - normalRotationCenter.x, baseLocation.y - normalRotationCenter.y);
        }
    }

    static calculateAncher(parentGeom: IBaseGeometry, geometry: IBaseGeometry): void {
        if (!parentGeom) return;

        if (parentGeom.getSize().equal(parentGeom.getCurrentSize())) {
            geometry.setCurrentLocation(parentGeom.getCurrentLocation());
            geometry.setCurrentSize(geometry.getSize());
            return;
        }

        const currentSize = parentGeom.getCurrentSize();
        const size = parentGeom.getSize();
        const currentLoc = parentGeom.getCurrentLocation();

        const anchorPoint = parentGeom.getCurrentLocation();
        const anchorSize = geometry.getSize();

        switch (geometry.anchor as number) {
            case 0:    // None *
                anchorPoint.x = currentLoc.x + ((currentSize.width - size.width) / 2);
                anchorPoint.y = currentLoc.y + ((currentSize.height - size.height) / 2);
                break;
            case 1:     // Top *
                anchorPoint.x = currentLoc.x + ((currentSize.width - size.width) / 2);
                anchorPoint.y = currentLoc.y;
                break;
            case 2:     // Bottom *
                anchorPoint.x = currentLoc.x + ((currentSize.width - size.width) / 2);
                anchorPoint.y = currentLoc.y + (currentSize.height - size.height);
                break;
            case 3:     // ToP | Bottom
                anchorSize.height = anchorSize.height + (currentSize.height - size.height);
                anchorPoint.x = currentLoc.y + ((currentSize.width - size.width) / 2);
                break;
            case 4:     // Left *
                anchorPoint.x = currentLoc.x;
                anchorPoint.y = currentLoc.y + ((currentSize.height - size.height) / 2);
                break;
            case 5:     // Top | Left
                anchorPoint.x = currentLoc.x;
                anchorPoint.y = currentLoc.y;
                break;
            case 6:     // Bottom | Left
                anchorPoint.x = currentLoc.x;
                anchorPoint.y = currentLoc.y + (currentSize.height - size.height);
                break;
            case 7:     // Top | Bottom | Left
                anchorPoint.x = currentLoc.x;
                anchorSize.height = anchorSize.height + (currentSize.height - size.height);
                break;
            case 8:     // Right *
                anchorPoint.x = currentLoc.x + (currentSize.width - size.width);
                anchorPoint.y = currentLoc.y + ((currentSize.height - size.height) / 2);
                break;
            case 9:     // Top | Right
                anchorPoint.x = currentLoc.x + (currentSize.width - size.width);
                anchorPoint.y = currentLoc.y;
                break;
            case 10:    // Bottom | Right
                anchorPoint.x = currentLoc.x + (currentSize.width - size.width);
                anchorPoint.y = currentLoc.y + (currentSize.height - size.height);
                break;
            case 11:    // Top : Bottom | Right
                anchorPoint.x = currentLoc.x + (currentSize.width - size.width);
                anchorSize.height = anchorSize.height + (currentSize.height - size.height);
                break;
            case 12:    // Left | Right
                anchorSize.width = anchorSize.width + (currentSize.width - size.width);
                anchorPoint.y = currentLoc.y + ((currentSize.height - size.height) / 2);
                break;
            case 13:    // Top | Left | Right
                anchorPoint.y = currentLoc.y;
                anchorSize.width = anchorSize.width + (currentSize.width - size.width);
                break;
            case 14:    // Bottom | Left | Right
                anchorPoint.y = currentLoc.y + (currentSize.height - size.height);
                anchorSize.width = anchorSize.width + (currentSize.width - size.width);
                break;
            case 15:    // Top | Bottom | Left | Right
                anchorPoint.y = currentLoc.y;
                anchorSize.height = anchorSize.height + (currentSize.height - size.height);
                anchorPoint.x = currentLoc.x;
                anchorSize.width = anchorSize.width + (currentSize.width - size.width);
                break;
        }

        geometry.setCurrentLocation(anchorPoint);
        geometry.setCurrentSize(anchorSize);
    }

    static getMBR(p1: Point[]): Rectangle {
        let minX = 999999;
        let minY = 999999;
        let maxX = 0;
        let maxY = 0;

        for (let index = 0; p1.length > index; index++)
        {
            if (p1[index].x < minX) minX = p1[index].x;
            if (p1[index].y < minY) minY = p1[index].y;
            if (p1[index].x > maxX) maxX = p1[index].x;
            if (p1[index].y > maxY) maxY = p1[index].y;
        }

        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    static getMaxSize(width: number, height: number, minimumSize: Size): Size {
        if (minimumSize.width !== 0 && minimumSize.height !== 0) {
            if (minimumSize.width > width && minimumSize.height > height) return Size.Empty();

            if (minimumSize.width > width) {
                width = minimumSize.width;
            }

            if (minimumSize.height > height){
                height = minimumSize.height;
            }
        }

        return new Size(width, height);
    }

    static isContainPoint(polygonPoint: Point[], x: number, y: number): boolean {
        let hitCount = 0;
        
        let maxX = 0;
        let maxY = 0;
        let minX = Number.MAX_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;

        polygonPoint.forEach((element) => {
            maxX = Math.max(maxX, element.x);
            maxY = Math.max(maxY, element.y);

            minX = Math.min(minX, element.x);
            minY = Math.min(minY, element.y);
        });

        if (maxX < x || x < minX)
            return false;
        
        if (maxY < y || y < minY)
            return false;
        
        const tPoint: Point[] = [];
        for (let idx = 0; idx < polygonPoint.length; idx++) {
            if (idx !== polygonPoint.length - 1) {
                tPoint.splice(idx, 0, polygonPoint[idx + 1]);
            } else {
                tPoint.splice(idx, 0, polygonPoint[0]);
            }
        }

        for (let idx = 0; idx < polygonPoint.length; idx++) {
            if (Math.min(polygonPoint[idx].y, tPoint[idx].y) > y) {
                continue;
            }

            if (Math.max(polygonPoint[idx].y, tPoint[idx].y) < y) {
                continue;
            }

            if (DrawableUtil.intersection(polygonPoint[idx], tPoint[idx], new Point(x, y), new Point(x + maxX, y))) {
                hitCount++;
            }
        }

        if (hitCount % 2 === 0) {
            return false;
        } else {
            return true;
        }
    }

    static isContainRectangle(polygonPoint: Point[], rect: Rectangle): boolean {
        let crossCount = 0;
        const reccPointArr = DrawableUtil.getVertex(rect);

        if (rect.containsRectangle(DrawableUtil.getMBR(polygonPoint))) {
            return true;
        }

        for (let i = 0; i < 4; i++) {
            if (DrawableUtil.isContainPoint(polygonPoint, reccPointArr[i].x, reccPointArr[i].y)) {
                crossCount++;
                break;
            }
        }

        if (crossCount > 0) return true;

        const tPoint = [];
        for (let idx = 0; idx < polygonPoint.length; idx++) {
            if (idx !== polygonPoint.length - 1) {
                tPoint[idx] = polygonPoint[idx + 1];
            } else {
                tPoint[idx] = polygonPoint[0];
            }
        }

        /* 교차여부 검사 */
        for (let idx = 0; idx < polygonPoint.length; idx++) {
            /* Rectangle Top Line */
            if (DrawableUtil.intersection(polygonPoint[idx], tPoint[idx], reccPointArr[0], reccPointArr[1])) {
                crossCount++;
                break;
            }

            /* Rectangle Right Line */
            if (DrawableUtil.intersection(polygonPoint[idx], tPoint[idx], reccPointArr[1], reccPointArr[2])) {
                crossCount++;
                break;
            }

            /* Rectangle Bottom Line */
            if (DrawableUtil.intersection(polygonPoint[idx], tPoint[idx], reccPointArr[3], reccPointArr[2])) {
                crossCount++;
                break;
            }

            /* Rectangle Right Line */
            if (DrawableUtil.intersection(polygonPoint[idx], tPoint[idx], reccPointArr[0], reccPointArr[3])) {
                crossCount++;
                break;
            }
        }

        return (crossCount === 0) ? false : true;
    }

    static intersectionPoint(p1: Point, p2: Point, p3: Point, p4: Point): Point {
        const point = new Point(0, 0);
        const num = (p1.y - p3.y) * (p4.x - p3.x) - (p1.x - p3.x) * (p4.y - p3.y);
        const den = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        const r = num / den;

        if (Number.isNaN(r))
        {
            point.x = Math.min(p1.x, p2.x) + Math.abs((p1.x - p2.x) / 2);
            point.y = Math.min(p1.y, p2.y) + Math.abs((p1.y - p2.y) / 2);
            return point;
        }

        point.x = p1.x + r * (p2.x - p1.x);
        point.y = p1.y + r * (p2.y - p1.y);

        return point;
    }

    static setDashStyle(ctx: CanvasRenderingContext2D, dashStyle: DashStyles): void {
        switch(dashStyle) {
            case DashStyles.Solid:
                ctx.setLineDash([]);
                break;
            case DashStyles.Dot:
                ctx.setLineDash([1, 1]);
                break;
            case DashStyles.Dash:
                ctx.setLineDash([10, 3]);
                break;
            case DashStyles.DashDot:
                ctx.setLineDash([10, 3, 3, 3]);
                break;
            case DashStyles.DashDotDot:
                ctx.setLineDash([10, 3, 3, 3, 3, 3]);
                break;
            case DashStyles.Custom:
                ctx.setLineDash([12, 3, 3]);
                break;
        }
    }

    private static intersection(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
        if ((DrawableUtil.signedArea(p1, p2, p3) * DrawableUtil.signedArea(p1, p2, p4) <= 0)
        && (DrawableUtil.signedArea(p3, p4, p1) * DrawableUtil.signedArea(p3, p4, p2) <= 0)) {
            return true;
        } else {
            return false;
        }
    }

    private static signedArea(p1: Point, p2: Point, p3: Point): number {
        const area = ((p1.x * p2.y - p1.y * p2.x) +
        (p2.x * p3.y - p2.y * p3.x) +
        (p3.x * p1.y - p3.y * p1.x));

        if (area >= 0)
            return 1;
        else
            return -1;
    }
}

export default DrawableUtil;