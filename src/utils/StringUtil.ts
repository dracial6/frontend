import { ContentAlignment, Point, Rectangle, Size } from "../drawing/structures";
import FontUtil from "./FontUtil";

class StringUtil {
    static getOldTextAlignPoint(textAlign: ContentAlignment, location: Point, fontSize: Size) : Point {
        let temp_X = location.x;
        let temp_Y = location.y;
        switch (textAlign) {
            case ContentAlignment.TopLeft:
                temp_X = location.x;
                temp_Y = location.y;
                break;
            case ContentAlignment.TopCenter:
                temp_X = location.x - fontSize.width / 2;
                temp_Y = location.y;
                break;
            case ContentAlignment.TopRight:
                temp_X = location.x - fontSize.width;
                temp_Y = location.y;
                break;
            case ContentAlignment.MiddleLeft:
                temp_X = location.x;
                temp_Y = location.y - fontSize.height / 2;
                break;
            case ContentAlignment.MiddleCenter:
                temp_X = location.x - fontSize.width / 2;
                temp_Y = location.y - fontSize.height / 2;
                break;
            case ContentAlignment.MiddleRight:
                temp_X = location.x - fontSize.width;
                temp_Y = location.y - fontSize.height / 2;
                break;
            case ContentAlignment.BottomLeft:
                temp_X = location.x;
                temp_Y = location.y - fontSize.height;
                break;
            case ContentAlignment.BottomCenter:
                temp_X = location.x - fontSize.width / 2;
                temp_Y = location.y - fontSize.height;
                break;
            case ContentAlignment.BottomRight:
                temp_X = location.x - fontSize.width;
                temp_Y = location.y - fontSize.height;
                break;
        }
        return new Point(temp_X, temp_Y);
    }

    static getAlignPoint(align: ContentAlignment, size: Size, alignBoundary: Rectangle) : Point {
        const alignPoint = FontUtil.updateAlign(size, "-", align
            , alignBoundary.x, alignBoundary.y, alignBoundary.width, alignBoundary.height);
        return new Point(alignPoint.x, alignPoint.y);
    }
}

export default StringUtil;