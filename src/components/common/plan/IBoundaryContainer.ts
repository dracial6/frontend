import BoundaryItem from "../items/BoundaryItem";
import TBoundary from "../TBoundary";

interface IBoundaryContainer {
    IBoundaryContainer: number;
    addBoundary(boundary: BoundaryItem): TBoundary | undefined;
    removeBoundary(boundary: BoundaryItem): void;
    removeAllBoundary(): void;
    setVisibleBoundary(visible: boolean): void;
    setVisibleBoundaryItem(boundary: BoundaryItem, visible: boolean): void;
}

export default IBoundaryContainer;