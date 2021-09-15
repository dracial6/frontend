import RowItem from "../components/shipplan/items/RowItem";
import { DisplayLayer } from "../drawing/structures";

class LayerUtil {
    static getLayerKeys(layerKeys: DisplayLayer[], hiddenLayer?: DisplayLayer): DisplayLayer[] {
        const list:DisplayLayer[] = [];

        layerKeys.forEach(layer => {
            if (hiddenLayer === undefined || (hiddenLayer & layer) <= 0) {
                list.push(layer);
            }
        });

        return list;
    }

    static getReverseLayerKeys(layerKeys: DisplayLayer[], hiddenLayer?: DisplayLayer): DisplayLayer[] {
        const list:DisplayLayer[] = [];

        for (let i = layerKeys.length - 1; i >= 0; i--) {
            if (hiddenLayer === undefined || (hiddenLayer & layerKeys[i]) <= 0) {
                list.push(layerKeys[i]);
            }
        }

        return list;
    }

    static getReverseLayerKeysLinkLayer(layerKeys: DisplayLayer[], hiddenLayer?: DisplayLayer, linkLayer?: DisplayLayer): DisplayLayer[] {
        const list:DisplayLayer[] = [];
        let baseDisplayLayer = LayerUtil.getDisplayLayer(layerKeys);

        if (baseDisplayLayer && hiddenLayer) {
            baseDisplayLayer = baseDisplayLayer ^ hiddenLayer;
        }

        if (baseDisplayLayer && linkLayer) {
            baseDisplayLayer = linkLayer & baseDisplayLayer;
        }
        
        if (!baseDisplayLayer) return list;

        for (let i = layerKeys.length - 1; i >= 0; i--) {
            if (((baseDisplayLayer & layerKeys[i]) <= 0) === false) {
                list.push(layerKeys[i]);
            }
        }

        return list;
    }

    static getDisplayLayer(layerKeys: DisplayLayer[]): DisplayLayer | undefined {
        if (layerKeys.length === 0) return undefined;

        let linkLayer: DisplayLayer | undefined = undefined;
        
        for (let i = 0; i < layerKeys.length; i++) {
            linkLayer = (!linkLayer) ? linkLayer = layerKeys[i] : linkLayer = linkLayer | layerKeys[i];
        }

        return linkLayer;
    }

    static getDisplayLayerLinkAll(isLink: boolean): DisplayLayer | undefined {
        if (!isLink) return undefined;

        let linkLayer: DisplayLayer | undefined = undefined;
        for (let i = 0; i < 6; i++) {
            linkLayer = (!linkLayer) ? linkLayer = i : linkLayer = linkLayer | i;
        }

        return linkLayer;
    }
}

export default LayerUtil;