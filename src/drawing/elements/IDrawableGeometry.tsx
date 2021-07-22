import IDrawable from "./IDrawable";
import { Cursors, DisplayLayer, Rectangle, ResizeVertex } from "../structures";
import Point from "../structures/Point";

interface IDrawableGeometry extends IDrawable {
    /// <summary>
    /// 선택된 상태 정보를 가져오거나 설정합니다.
    /// </summary>
    isSelected: boolean
    /// <summary>
    /// 특정 도형 객체에 포함된 그룹객체 여부를 가져오거나 설정합니다.
    /// Indicates whether the Geometry Group is member.
    /// </summary> 
    isMemberGeomGroup: boolean
    /// <summary>
    /// 도형 객체의 마우스 이벤트 반응 여부를 가져오거나 설정합니다.
    /// Indicates whether the Geometry is background image.
    /// this Geometry object can not select, move, resize and dragDrop
    /// </summary>
    isBackground: boolean
    /// <summary>
    /// 크기조절 가능 여부를 가져오거나 설정합니다.
    /// </summary>
    enableResizable: boolean
    /// <summary>
    /// 이동 가능 여부를 가져오거나 설정합니다.
    /// </summary>
    enableMove: boolean
    /// <summary>
    /// 크기조절 가능 위치값을 가져오거나 설정합니다.
    /// </summary>
    enableResizeVertex: ResizeVertex
    /// <summary>
    /// 회전 축의 위치값을 가져오거나 설정합니다.
    /// </summary>
    rotationCenter: Point;
    /// <summary>
    /// Mouser Over Event 적용 여부를 가져오거나 설정합니다.
    /// </summary>
    enableMouseOver: boolean;
    /// <summary>
    /// 도형 겍체가 표현될 레이어의 위치를 가져오거나 설정합니다.
    /// </summary>
    layer: DisplayLayer;
    getIsOvered(): boolean;
    setIsOvered(isOvered: boolean): void;
    /// <summary>
    /// 객체가 point 값을 포함하면 0 이상의 값을 반환
    /// 포함되지 않을 경우 -1 반환
    /// </summary>
    /// <param name="point"></param>
    /// <returns></returns>
    hitTest(point: Point): number;
    /// <summary>
    /// 지정된 점이 이 객체의 표현영역 안에 들어 있는지 여부를 확인한다.
    /// </summary>
    /// <param name="point"></param>
    /// <returns></returns>
    pointInObject(point: Point): boolean;
    /// <summary>
    /// 입력된 위치에 표현된 Geometry 객체가 있는지를 확인한다.
    /// </summary>
    /// <param name="point">DrawArea의 절대 위치 값</param>
    /// <returns>입력된 위치값에 표현된 Geometry 객체가 있을 경우 true로 반환한다.</returns>
    Contains(point: Point): boolean;
    /// <summary>
    /// 입력된 위치가 MBR 영역에 포함되는지 확인한다.
    /// </summary>
    /// <param name="point">DrawArea의 절대 위치 값</param>
    /// <returns>입력된 위치값에 DrawableObject의 MBR영역에 포함되면 true로 반환한다.</returns>
    containsAtMBRPoint(point: Point): boolean;
    /// <summary>
    /// 입력된 영역과 MBR 영역의 포함관계를 확인한다.
    /// </summary>
    /// <param name="rectangle">DrawArea의 절대값 영역</param>
    /// <returns>
    /// 입력된 영역을 포함할 경우 1을 반환한다.
    /// 입력된 영역을 포함될 경우 -1을 반환한다.
    /// 입력된 영역과 교차(Intersect)될 경우 2을 반환한다.
    /// 입력된 영역과 겹치지 않을 경우 0을 반환한다.
    /// </returns>
    containsAtMBRRectangle(rectangle: Rectangle): number;
    /// <summary>
    /// deltaX, deltaY 기준으로 위치 이동
    /// </summary>
    /// <param name="deltaX"></param>
    /// <param name="deltaY"></param>
    move(deltaX: number, deltaY: number): void;
    /// <summary>
    /// 특정 방향으로 크기변경
    /// 입력된 위치 정보를 기준으로 입력된 크기 만큼 객체를 이동시킨다.
    /// </summary>
    /// <param name="point">변경된 크기값</param>
    /// <param name="handleNumber">크기 변경 위치 정보</param>
    moveHandleTo(point: Point, handleNumber: number): void;    
    /// <summary>
    /// 조작가능한 위치에 맞는 커서를 반환한다.
    /// Resize 시 handleNumber에 해당하는 Cursor 반환
    /// </summary>
    /// <param name="handleNumber"></param>
    /// <returns></returns>
    getHandleCursor(handleNumber: number): Cursors;
    /// <summary>
    /// 위치 및 크기값을 일반화합니다.
    /// Normalize object.
    /// Call this function in the end of object resizing.
    /// </summary>
    normalize(): void;
    /// <summary>
    /// 선택된 객체에 Resize 가능한 위치 표현합니다.
    /// </summary>
    /// <param name="g"></param>
    drawTracker(ctx: any, isResize: boolean): void;
    /// <summary>
    /// 선택된 객체에 외각 테두리를 표현합니다.
    /// </summary>
    /// <param name="g"></param>
    drawSelectedOutLine(ctx: any): void;
    /// <summary>
    /// 입력된 표현영역이 이 도형 객체의 영역과 교가되는지 여부를 확인합니다.
    /// </summary>
    /// <param name="rectangle"></param>
    /// <returns></returns>
    intersectsWith(rectangle: Rectangle): boolean;
    /// <summary>
    /// 지정된 지점으로 위치를 이동시킨다.
    /// </summary>
    /// <param name="point"></param>
    movePoint(point: Point): void;
    /// <summary>
    /// 도형 객체와 모든 해당 자식 도형 객체가 가지는 회적값을 반환한다.
    /// </summary>
    /// <returns></returns>
    getTotalDegree(): number;    
}

export default IDrawableGeometry;