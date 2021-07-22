import BayItem from "../items/BayItem";
import CEHeightTypes from "../structures/CEHeightTypes";

class CalculateHighCubeSize {
    private readonly BaseHeight = 262;
    private readonly FT43Gap = -120;
    private readonly FT80Gap = -20;
    private readonly FT86Gap = 0;
    private readonly FT96Gap = 30;

    private _ft43;
    private _ft80;
    private _ft86;
    private _ft96;
    private _maxHatchCoverClearHeight = 0;

    constructor(){
        this._ft43 = (this.BaseHeight + this.FT43Gap) / this.BaseHeight;
        this._ft80 = (this.BaseHeight + this.FT80Gap) / this.BaseHeight;
        this._ft86 = (this.BaseHeight + this.FT86Gap) / this.BaseHeight;
        this._ft96 = (this.BaseHeight + this.FT96Gap) / this.BaseHeight;
    }

    public getContainerHeight(baseHeight: number, heightType: CEHeightTypes): number {
        switch (heightType) {
            case CEHeightTypes.H43: return baseHeight * this._ft43;
            case CEHeightTypes.H80: return baseHeight * this._ft80;
            case CEHeightTypes.H86: return baseHeight;
            case CEHeightTypes.H96: return baseHeight * this._ft96;
            default: return baseHeight;
        }
    }

    public getContainerHeightRate(heightType: CEHeightTypes): number {
        switch (heightType) {
            case CEHeightTypes.H43: return this._ft43;
            case CEHeightTypes.H80: return this._ft80;
            case CEHeightTypes.H86: return this._ft86;
            case CEHeightTypes.H96: return this._ft96;
            default: return 1;
        }
    }

    public getDeckLoadingTopHeight(baseHeight: number, hatchCoverClear: number[]): number[] {
        if (hatchCoverClear.length === 0) return hatchCoverClear;

        const hatchCoverClearHeight: number[] = [];
        this._maxHatchCoverClearHeight = -999;
        const count = hatchCoverClear.length;

        for (let idx = 0; idx < count; idx++) {
            if (this._maxHatchCoverClearHeight < hatchCoverClear[idx])
            {
                this._maxHatchCoverClearHeight = hatchCoverClear[idx];
            }
        }

        if (this._maxHatchCoverClearHeight === 0) {
            this._maxHatchCoverClearHeight = 1;
        }

        for (let idx = 0; idx < count; idx++) {
            if (this._maxHatchCoverClearHeight === 1) {
                hatchCoverClearHeight[idx] = 1;
            } else {
                hatchCoverClearHeight[idx] = (baseHeight * hatchCoverClear[idx]) / this.BaseHeight;
            }
        }

        return hatchCoverClearHeight;
    }

    public getMaxHatchCoverClearHeight(baseHeight: number): number {
        if (this._maxHatchCoverClearHeight === 1) return 1;

        return (baseHeight * this._maxHatchCoverClearHeight) / this.BaseHeight;
    }

    public getMaxHatchCoverClearHeightBayItem(vesselBays: BayItem[], baseHeight: number): number {
        let maxHatchCoverClearHeight = 0;
        let tempMaxHeight = -999;

        if (vesselBays.length === 0) return maxHatchCoverClearHeight;

        try {
            const bayCount = vesselBays.length;
            let hatchCoverClear: number[] = [];
            for (let bayIdx = 0; bayIdx < bayCount; bayIdx++) {
                if (!vesselBays[bayIdx]) continue;
                if (!vesselBays[bayIdx].cogItem) continue;
                if (!vesselBays[bayIdx].cogItem.hatchCoverClear) continue;

                hatchCoverClear = vesselBays[bayIdx].cogItem.hatchCoverClear;

                const count = hatchCoverClear.length;

                for (let idx = 0; idx < count; idx++) {
                    if (tempMaxHeight < hatchCoverClear[idx]) {
                        tempMaxHeight = hatchCoverClear[idx];
                    }
                }
            }

            if (tempMaxHeight === 0) {
                tempMaxHeight = 1;
            }

            maxHatchCoverClearHeight = (baseHeight * tempMaxHeight) / this.BaseHeight;
        } catch (error) {
            maxHatchCoverClearHeight = 0;
        }        

        return maxHatchCoverClearHeight;
    }

    public getMaxHatchCoverClearHeightBase(baseHeight: number, hatchCoverClear: number[]): number {
        if (hatchCoverClear.length === 0) return 0;

        let hatchCoverClearHeight = 0;
        let maxHatchCoverClearHeight = -999;
        const count = hatchCoverClear.length;
        
        for (let idx = 0; idx < count; idx++) {
            if (maxHatchCoverClearHeight < hatchCoverClear[idx]) {
                maxHatchCoverClearHeight = hatchCoverClear[idx];
            }
        }

        hatchCoverClearHeight = (baseHeight * maxHatchCoverClearHeight) / this.BaseHeight;

        if (hatchCoverClearHeight === 0) return 1;

        return hatchCoverClearHeight;
    }
}

export default CalculateHighCubeSize;