interface IDrawableMouseEvent {
    onMouseDown(sender: any, event: MouseEvent): void;
    onMouseMove(sender: any, event: MouseEvent): void;
    onMouseUp(sender: any, event: MouseEvent): void;
    onSelected(sender: any, event: MouseEvent): void;
    onMouseHover(sender: any, event: MouseEvent): void;
    onMouseLeave(sender: any, event: MouseEvent): void;
    onResize(sender: any, event: MouseEvent): void;
    onResizeBegin(sender: any, event: MouseEvent): void;
    onResizeEnd(sender: any, event: MouseEvent): void;
    onMoveBegin(sender: any, event: MouseEvent): void;
    onMouseEnd(sender: any, event: MouseEvent): void;
}

export default IDrawableMouseEvent;