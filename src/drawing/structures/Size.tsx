class Size {
    width: number;
    height: number;

    static Empty(): Size {
        return new Size(0, 0);
    }

    constructor(width: number, height: number) {
        this.width  = width;
        this.height = height;
    }

    equal(size: Size): boolean {
        if (this.width === size.width && this.height === size.height) {
            return true;
        }

        return false;
    }
}

export default Size;