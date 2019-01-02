import {Graphics} from '../../types';
import { AmazonsTerrain, AmazonsUnit } from './_types';

const amazonsGraphics: Graphics<AmazonsTerrain, AmazonsUnit> = {
  icons: {
    queens: "queen",
    fires: "pawn"
  },
  tiles: {}
};

export default amazonsGraphics;