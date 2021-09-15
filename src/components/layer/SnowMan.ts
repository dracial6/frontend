import GeometryEllipse from "../../drawing/elements/GeometryEllipse";
import GeometryRectangle from "../../drawing/elements/GeometryRectangle";
import GeometryText from "../../drawing/elements/GeometryText";
import LayerDrawableObject from "../../drawing/elements/LayerDrawableObject";
import { Color, ContentAlignment, DisplayLayer, FontStyles, Rectangle, Size } from "../../drawing/structures";
import StringUtil from "../../utils/StringUtil";

class SnowMan extends LayerDrawableObject {
    private _headSize = 100;
    private _bodySize = 120;
    private _topPadding = 0;
    private _leftPadding = 0;
    private _layer: DisplayLayer;

    constructor(name: string, size: number, layer: DisplayLayer) {
        super(name);
        this._headSize = size;
        this._bodySize = size * 1.2;
        this._topPadding = size * 0.15;
        this._leftPadding = (this._bodySize - size) / 2;
        this._layer = layer;

        this.addLayer1();
        this.addLayer2();
        this.addLayer3();

        this.updateMBR();
    }

    private addLayer1(): void {
        const startY = this._topPadding;

        const boundary = new Rectangle(0, startY, this._bodySize, this._bodySize + this._headSize);
        const headPos = StringUtil.getAlignPoint(ContentAlignment.TopCenter, new Size(this._headSize, this._headSize), boundary);

        const head = new GeometryEllipse("Head", headPos.x, headPos.y, this._headSize, this._headSize);
        head.attribute.fillColor = Color.White();
        this.addGeomObjectLayerBackground(head, false, DisplayLayer.One);

        const bodyPos = StringUtil.getAlignPoint(ContentAlignment.BottomCenter, new Size(this._bodySize, this._bodySize), boundary);

        const body = new GeometryEllipse("Body", bodyPos.x, bodyPos.y, this._bodySize, this._bodySize);
        body.attribute.fillColor = Color.White();
        this.addGeomObjectLayerBackground(body, false, DisplayLayer.One);
    }

    private addLayer2(): void {
        let startX = this._leftPadding;
        let startY = this._topPadding;

        const eyeAreaWidth = this._headSize * 0.5;
        const eyeAreaHeight = this._headSize * 0.7;

        const headBoundary = new Rectangle(0, 0, eyeAreaWidth, this._headSize);
        const eyeWidth = (this._headSize / 2) * 0.65;
        const eyeHeight = this._headSize * 0.12;

        const leftEyePos = StringUtil.getAlignPoint(ContentAlignment.MiddleCenter, new Size(eyeWidth, eyeHeight), new Rectangle(startX, startY, eyeAreaWidth, eyeAreaHeight));

        const leftEye = new GeometryRectangle("Left_Eye", leftEyePos.x, leftEyePos.y, eyeWidth, eyeHeight);
        leftEye.attribute.fillColor = Color.Yellow();
        this.addGeomObjectLayerBackground(leftEye, false, DisplayLayer.Two);

        const rightEyePos = StringUtil.getAlignPoint(ContentAlignment.MiddleCenter, new Size(eyeWidth, eyeHeight), new Rectangle(startX + eyeAreaWidth, startY, eyeAreaWidth, eyeAreaHeight));

        const rightEye = new GeometryRectangle("Right_Eye", rightEyePos.x, rightEyePos.y, eyeWidth, eyeHeight);
        rightEye.attribute.fillColor = Color.Yellow();
        this.addGeomObjectLayerBackground(rightEye, false, DisplayLayer.Two);

        const noseWidth = this._headSize * 0.12;
        const noseHeight = this._headSize * 0.35;
        const noseaHeight = this._headSize * 0.85;
        const nosePos = StringUtil.getAlignPoint(ContentAlignment.BottomCenter, new Size(noseWidth, noseHeight), new Rectangle(startX, startY, this._headSize, noseaHeight));

        const nose = new GeometryRectangle("Nose", nosePos.x, nosePos.y, noseWidth, noseHeight);
        nose.attribute.fillColor = Color.Yellow();
        this.addGeomObjectLayerBackground(nose, false, DisplayLayer.Two);


        const buttonCount = 3;
        const buttonSize = this._headSize * 0.15;
        const buttonAreaHeight = this._bodySize / buttonCount;
        const buttonAreaWidth = this._bodySize;

        startX = 0;
        startY = this._topPadding + this._headSize;

        for (let i = 0; i < buttonCount; i++) {
            const buttonPos = StringUtil.getAlignPoint(ContentAlignment.MiddleCenter, new Size(buttonSize, buttonSize), new Rectangle(startX, startY + (buttonAreaHeight * i), buttonAreaWidth, buttonAreaHeight));

            const button = new GeometryEllipse("Button_" + i, buttonPos.x, buttonPos.y, buttonSize, buttonSize);
            button.attribute.fillColor = Color.Yellow();
            this.addGeomObjectLayerBackground(button, false, DisplayLayer.Two);
        }
    }

    private addLayer3(): void {
        const title = new GeometryText("Title", 0, 0, "Snowman");
        title.attribute.fontSize = 15 * (this._headSize / 100);
        title.attribute.lineColor = Color.Black();
        title.attribute.fontName = "Arial";
        title.attribute.fontStyle = FontStyles.bold;
        this.addGeomObjectLayerBackground(title, false, DisplayLayer.Three);

        const title2 = new GeometryText("Title_Layer", 0, title.getRealTextSize().height, "Layer" + this._layer);
        title2.attribute.fontSize = 15 * (this._headSize / 100);
        title2.attribute.lineColor = Color.Red();
        title2.attribute.fontName = "Arial";
        title2.attribute.fontStyle = FontStyles.bold;
        this.addGeomObjectLayerBackground(title2, false, DisplayLayer.Three);
    }
}

export default SnowMan;