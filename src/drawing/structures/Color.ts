class Color{    
    alpha = 0;
    red = 0;
    green = 0;
    blue = 0;
    
    static Transparent(): Color {
        return new Color(0, 0, 0, 0);
    }

    static White(): Color { 
        return new Color(255, 255, 255, 1);
    }
    
    static Black(): Color {
        return new Color(0, 0, 0, 1);
    }

    static Red(): Color {
        return new Color(255, 0, 0, 1);
    }

    static Green(): Color {
        return new Color(0, 255, 0, 1);
    }

    static Blue(): Color {
        return new Color(0, 0, 255, 1);
    }

    static Gray(): Color {
        return new Color(128, 128, 128, 1);
    }

    static Silver(): Color {
        return new Color(192, 192, 192, 1);
    }

    static LightGray(): Color {
        return new Color(211, 211, 211, 1);
    }

    static DarkGray(): Color {
        return new Color(169, 169, 169, 1);
    }

    static Yellow(): Color {
        return new Color(255, 255, 0, 1);
    }

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toRGBA(): string {
        //return "#" + ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);
        return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
    }
}

export default Color;