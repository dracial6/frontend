import React, { RefObject } from "react";

class StaticCanvas extends React.Component {
    private static _canvasContext: CanvasRenderingContext2D | undefined;
    private static _canvasRef: RefObject<HTMLCanvasElement>;

    componentDidMount() {
        const canvas = StaticCanvas._canvasRef.current;
        if (canvas) StaticCanvas._canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    static getContext(): CanvasRenderingContext2D | undefined {
        return StaticCanvas._canvasContext;
    }

    render() {
        return (
            <div>
                <canvas ref={StaticCanvas._canvasRef} />
            </div>
        );
    }
}

export default StaticCanvas;