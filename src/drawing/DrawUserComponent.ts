import React from "react";
import BaseDrawArea from "./BaseDrawArea";
import { DrawAreaViewState } from "./structures";
import ArrangeDirection from "./structures/ArrangeDirection";

class DrawUserComponent extends React.Component {
    protected MyDrawArea!: BaseDrawArea;

    constructor(props: any){
        super(props);
    }

    getDrawArea(): BaseDrawArea {
        return this.MyDrawArea;
    }

    setDrawArea(drawArea: BaseDrawArea): void {
        this.MyDrawArea = drawArea;
    }

    refresh(): void {
        if (this.MyDrawArea) this.MyDrawArea.refresh();
    }

    setArrangeDirection(arrangeDirection: ArrangeDirection): void {
        if (this.MyDrawArea) this.MyDrawArea.setArrangeDirection(arrangeDirection);
    }

    setArrangeTopMargin(arrangeTopMargin: number): void {
        if (this.MyDrawArea) this.MyDrawArea.arrangeTopMargin = arrangeTopMargin;
    }

    setArrangeLeftMargin(arrangeLeftMargin: number): void {
        if (this.MyDrawArea) this.MyDrawArea.arrangeLeftMargin = arrangeLeftMargin;
    }

    setRightExtendsionMargin(rightExtendsionMargin: number): void {
        if (this.MyDrawArea) this.MyDrawArea.rightExtendsionMargin = rightExtendsionMargin;
    }

    setArrangeFixCount(arrangeFixCount: number): void {
        if (this.MyDrawArea) this.MyDrawArea.arrangeFixCount = arrangeFixCount;
    }

    setVisibleMouseDragLine(visibleMouseDragLine: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.visibleMouseDragLine = visibleMouseDragLine;
    }

    setEnableMouseRightButton(enableMouseRightButton: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.enableMouseRightButton = enableMouseRightButton;
    }

    setIsChanged(isChanged: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.isChanged = isChanged;
    }

    setIsDrawableObjectMouseOver(isDrawableObjectMouseOver: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.isDrawableObjectMouseOver = isDrawableObjectMouseOver;
    }

    setAllowDragAtDrawControl(allowDragAtDrawControl: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.setAllowDragAtDrawControl(allowDragAtDrawControl);
    }

    setIsChildDrawableObjectSelect(isChildDrawableObjectSelect: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.isChildDrawableObjectSelect = isChildDrawableObjectSelect;
    }

    setIsDrawableMemoryCache(isDrawableMemoryCache: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.isDrawableMemoryCache = isDrawableMemoryCache;
    }

    setEnableViewStatusChange(enableViewStatusChange: boolean): void {
        if (this.MyDrawArea) this.MyDrawArea.setEnableViewStatusChange(enableViewStatusChange);
    }

    setViewStatus(setViewStatus: DrawAreaViewState): void {
        if (this.MyDrawArea) this.MyDrawArea.setViewStatus(setViewStatus);
    }

    getPageScale(): number {
        if (this.MyDrawArea) return this.MyDrawArea.getPageScale();
        else return 1;
    }

    setPageScale(pageScale: number): void {
        if (this.MyDrawArea) this.MyDrawArea.setPageScale(pageScale);
    }

    getComponentStyle(): CSSStyleDeclaration {
        return this.MyDrawArea.getComponentStyle();
    }
}

export default DrawUserComponent;