import { RGBFromHex,  ObjPaths, CtryOffsets, ColourScheme } from './types'

export const DEFAULTFILEPATHS: ObjPaths = {
    enContours: '../Canvas/assets/ptsEn.json',
    scContours: '../Canvas/assets/ptsSc.json',
    waContours: '../Canvas/assets/ptsWa.json',
    niContours: '../Canvas/assets/ptsNi.json',
    gbContours: '../Canvas/assets/ptsGb.json',
    irContours: '../Canvas/assets/ptsIr.json'
}

export const DEFAULTOFFSETS: CtryOffsets = {
    en: [0,0],
    sc: [-98, -246],
    wa: [-72, 8],
    ni: [-170, -118],
    gb: [-59, -122],
    ir: [-212, -45]
}

export const COLOURSLIGHT: ColourScheme = {
    // background: RGBFromHex("#4769CC"),
    // stroke: RGBFromHex("#090F20"),
    // gradientDark: RGBFromHex("#AD4747"),
    // gradientLight: RGBFromHex("#84AD47"),
    // gradientNull: RGBFromHex("#476EAD")
    background: {r: 71, g: 105, b: 204},
    stroke: {r: 9, g: 15, b: 32},
    gradientDark: {r: 173, g: 71, b: 71},
    gradientLight: {r: 132, g: 173, b: 71},
    gradientNull: {r: 71, g: 110, b: 173}
} 