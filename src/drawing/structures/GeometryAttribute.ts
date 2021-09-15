import Color from './Color';
import DashStyles from './DashStyles';
import FontStyles from './FontStyles';
import ContentAlignment from './ContentAlignment';
import Font from './Font';
import LineAlignment from './LineAlignment';

interface IGeometryAttribute {
    lineColor: Color;
    lineThick: number;
    dashStyle: DashStyles;
    fillColor: Color;
    fontName: string;
    fontSize: number;
    fontStyle: FontStyles;
    radiusEdge: boolean;
    textAlign: ContentAlignment;
    lineAlign: LineAlignment;
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
    radiusEdge = false;
    textAlign: ContentAlignment = ContentAlignment.TopLeft;
    lineAlign = LineAlignment.Center;
    opacity = 1;
    isFill = true;
    font: Font = new Font("tahoma", 9, FontStyles.normal);
    outLineColor: Color = Color.Black();
    isOutLine = false;
    textOutLineThick = 0;
    textOutLineColor: Color = Color.Black();    
}

export default GeometryAttribute;