class Size {
    width: number;
    height: number;

    static empty(): Size {
        return new Size(0, 0);
    }

    static isEmpty(size: Size): boolean {
        return size.width === 0 && size.height === 0;
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