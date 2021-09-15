import { Color } from "../drawing/structures";

class ColorUtil {
    static getArgbColorOpacity(color: Color, opacity: number): Color {
        let alpha = 0;
        if (color.alpha > 0) alpha = color.alpha * opacity;
        return new Color(color.red, color.green, color.blue, alpha);
    }
}

export default ColorUtil;