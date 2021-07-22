import React, { RefObject } from "react";
import BaseDrawArea from "../BaseDrawArea";
import ArrangeDirection from "../structures/ArrangeDirection";

class DrawUserComponent extends React.Component {
    protected MyDrawArea?: BaseDrawArea;

    constructor(props: any){
        super(props);
    }

    setDrawArea(drawArea: BaseDrawArea): void {
        this.MyDrawArea = drawArea;
    }

    setArrangeDirection(arrangeDirection: ArrangeDirection): void {
        if (this.MyDrawArea) this.MyDrawArea.arrangeDirection = arrangeDirection;
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
}

export default DrawUserComponent;