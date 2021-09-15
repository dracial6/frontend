class Padding {
    public left: number;
    public top: number;
    public right: number;
    public bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left  = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    static readonly Empty = new Padding(0, 0, 0, 0);

    public equal(padding: Padding): boolean {
        if (this.left === padding.left && this.top === padding.top && this.right === padding.right && this.bottom === padding.bottom) {
            return true;
        }

        return false;
    }
}

export default Padding;