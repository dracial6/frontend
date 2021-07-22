enum OperationMode {
    None = 0,
    NetSelection = 1,   // group selection is active
    Move = 2,           // object(s) are moves
    Size = 4,           // object is resized
    Hover = 8,          // object is mouse over
    Leave = 16,          // object is mouse leave
    DragDrop = 23,       // object is Drag And Drop
    MouseDown = 64
}

export default OperationMode;