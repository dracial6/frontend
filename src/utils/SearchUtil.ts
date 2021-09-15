import BaseDrawableObject from "../drawing/elements/BaseDrawableObject";
import IDrawableGeometry from "../drawing/elements/IDrawableGeometry";
import { Point } from "../drawing/structures";

class SearchUtil {
    static getGeometryListByMember(list: IDrawableGeometry[], memberName: string): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];
        if (list.length === 0) return [];

        list.forEach(element => {
            if (memberName in element) {
                returnList.push(element);
            }
        });

        return returnList;
    }

    static getGeometryListByMemberPoint(sourceList: IDrawableGeometry[], memberName: string, visible: boolean | undefined, deepSearch: boolean, point: Point | undefined): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];
        let isContain = true;

        if (sourceList.length === 0) return returnList;

        let drawableGeometry: BaseDrawableObject;
        let tempList = [];
        let tempList1 = [];

        for (let i = 0; i < sourceList.length; i++) {
            const item = sourceList[i];
            if (visible && item.visible !== visible) continue;
            if (point) isContain = item.pointInObject(point);
            if (isContain && deepSearch && item instanceof BaseDrawableObject) {
                drawableGeometry = item as BaseDrawableObject;
                tempList = drawableGeometry.getGeomListByMember("IDrawableGeometry") as IDrawableGeometry[];
                tempList1 = SearchUtil.getGeometryListByMemberPoint(tempList, memberName, visible, deepSearch, point);

                if (tempList1.length > 0) {
                    returnList.push(...tempList1);
                }
            }

            if (!isContain) continue;

            if (memberName in item) {
                returnList.push(item);
            }
        }

        return returnList;
    }

    static getGeometryListByMemberSelected(sourceList: IDrawableGeometry[], memberName: string, visible: boolean | undefined, deepSearch: boolean, isSelected: boolean): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];

        if (sourceList.length === 0) return returnList;

        let drawableGeometry: BaseDrawableObject;
        let tempList = [];
        let tempList1 = [];

        for (let i = 0; i < sourceList.length; i++) {
            const item = sourceList[i];
            if (visible && item.visible !== visible) continue;
            if (deepSearch && item instanceof BaseDrawableObject) {
                drawableGeometry = item as BaseDrawableObject;
                tempList = drawableGeometry.getGeomListByMember("IDrawableGeometry") as IDrawableGeometry[];
                tempList1 = SearchUtil.getGeometryListByMemberSelected(tempList, memberName, visible, deepSearch, isSelected);

                if (tempList1.length > 0) {
                    returnList.push(...tempList1);
                }
            }

            if (item.isSelected !== isSelected) continue;

            if (memberName in item) {
                returnList.push(item);
            }
        }

        return returnList;
    }
}

export default SearchUtil;