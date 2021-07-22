interface IDragable {
    isDragable: boolean; // false일 경우 = ISelectable과 동일.
    getDragData(): object;
}

export default IDragable;