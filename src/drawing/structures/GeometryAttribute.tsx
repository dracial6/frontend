import Color from './Color';
import DashStyles from './DashStyles';
import FontStyles from './FontStyles';
import ContentAlignment from './ContentAlignment';
import Font from './Font';

interface IGeometryAttribute {
    lineColor: Color;
    lineThick: number;
    dashStyle: DashStyles;
    fillColor: Color;
    fontName: string;
    fontSize: number;
    fontStyle: FontStyles;
    radius: number;
    textAlign: ContentAlignment;
    opacity: number;
    isFill: boolean;
    font: Font;
    outLineColor: Color;
    isOutLine: boolean;
    textOutLineThick: number;
    textOutLineColor: Color;
}

class GeometryAttribute implements IGeometryAttribute {
    lineColor: Color = Color.Black();
    lineThick = 1;
    dashStyle: DashStyles = DashStyles.Solid;
    fillColor: Color = new Color(0, 0, 0, 0);
    fontName = 'tahoma';
    fontSize = 8;
    fontStyle: FontStyles = FontStyles.normal;
    radius = 0;
    textAlign: ContentAlignment = ContentAlignment.TopLeft;
    opacity = 1;
    isFill = true;
    font: Font = new Font("Tahoma", 9, FontStyles.normal);
    outLineColor: Color = Color.Black();
    isOutLine = false;
    textOutLineThick = 0;
    textOutLineColor: Color = Color.Black();
}

export default GeometryAttribute;