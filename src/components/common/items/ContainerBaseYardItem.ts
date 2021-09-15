import ContainerBaseItem from "./ContainerBaseItem";

class ContainerBaseYardItem extends ContainerBaseItem {
    private _occupiedSlotCount = 0;

    getOccupiedSlotCount(): number {
        return this._occupiedSlotCount;
    }

    setOccupiedSlotCount(occupiedSlotCount: number): void {
        if (occupiedSlotCount > 0) {
            occupiedSlotCount = 4;
        }

        this._occupiedSlotCount = occupiedSlotCount;
    }
}

export default ContainerBaseYardItem;