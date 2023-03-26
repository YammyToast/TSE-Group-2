import { ImgPaths, ObjPaths, CtryOffsets, ColourScheme } from './types'


export const DEFAULTFILEPATHS: ObjPaths = {
    enContours: '../Canvas/assets/ptsEn.json',
    scContours: '../Canvas/assets/ptsSc.json',
    waContours: '../Canvas/assets/ptsWa.json',
    niContours: '../Canvas/assets/ptsNi.json',
    irContours: '../Canvas/assets/ptsIr.json',
}

export const DEFAULTIMGPATHS: ImgPaths = {
    rainfall: '../Canvas/assets/rainfall.svg',
    sunshine: '../Canvas/assets/sunshine.svg',
    lowTemp: '../Canvas/assets/lowTemp.svg',
    highTemp: '../Canvas/assets/highTemp.svg',
}

export const DEFAULTOFFSETS: CtryOffsets = {
    en: [0, 0],
    sc: [-98, -246],
    wa: [-72, 8],
    ni: [-170, -118],
    ir: [-212, -44]
}

export const DEFAULTLABELS = {
    enLabel: { owner: 'en', title: 'England', offset: [135, -20] },
    scLabel: { owner: 'sc', title: 'Scotland', offset: [10, -300] },
    waLabel: { owner: 'wa', title: 'Wales', offset: [-200, -50] },
    niLabel: { owner: 'ni', title: 'Nth. Ire.', offset: [-325, -200] },
}

export const COLOURSLIGHT: ColourScheme = {
    background: { r: 71, g: 105, b: 204 },
    stroke: { r: 9, g: 15, b: 32 },
    gradientDark: { r: 173, g: 71, b: 71 },
    gradientLight: { r: 132, g: 173, b: 71 },
    gradientNull: { r: 71, g: 110, b: 173 },
    labelBackground: "#242124",
    labelText: "#FCFCFC"
}
//

export function createLabel(_colorScheme: ColourScheme): JQuery<HTMLElement> {
    return jQuery(`
    <div class="canvas-label" style="background:${_colorScheme.labelBackground}; color:${_colorScheme.labelText}">
        <div class="canvas-label-title" id="canvas-label-title"></div>
        <div class="canvas-label-row" id="rainfall">
            <svg viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.00006 13.5H23.5001" stroke="${_colorScheme.labelText}" stroke-width="2" />
                <circle cx="4" cy="11" r="3.5" fill="${_colorScheme.labelText}" />
                <circle cx="23.5" cy="10.5" r="4" fill="${_colorScheme.labelText}" />
                <circle cx="18" cy="9" r="5" fill="${_colorScheme.labelText}" />
                <circle cx="7.5" cy="7.5" r="4.5" fill="${_colorScheme.labelText}" />
                <circle cx="12.5" cy="5.5" r="5.5" fill="${_colorScheme.labelText}" />
                <rect x="6" y="8" width="10" height="5" fill="${_colorScheme.labelText}" />
                <line x1="11.4" y1="17.2" x2="16.2" y2="23.6" stroke="${_colorScheme.labelText}" stroke-width="2"
                    stroke-linecap="round" />
                <line x1="5.4" y1="17.2" x2="7.8" y2="20.4" stroke="${_colorScheme.labelText}" stroke-width="2"
                    stroke-linecap="round" />
                <line x1="18.4" y1="17.2" x2="21.4" y2="21.2" stroke="${_colorScheme.labelText}" stroke-width="2"
                    stroke-linecap="round" />
            </svg>
            <div id="canvas-label-text-rainfall">Text</div>
        
        </div>
        <div class="canvas-label-row">
            <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="13" y1="1" x2="13" y2="5" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="13" y1="21" x2="13" y2="25" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="25" y1="13" x2="21" y2="13" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="5" y1="13" x2="1" y2="13" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="21.4853" y1="4.51474" x2="20.0711" y2="5.92895" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="7.34314" y1="18.6568" x2="5.92893" y2="20.071" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="21.4853" y1="21.4853" x2="20.071" y2="20.0711" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <line x1="7.34317" y1="7.34314" x2="5.92896" y2="5.92893" stroke="${_colorScheme.labelText}" stroke-width="2" stroke-linecap="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13 19C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7C9.68629 7 7 9.68629 7 13C7 16.3137 9.68629 19 13 19ZM13 17C15.2091 17 17 15.2091 17 13C17 10.7909 15.2091 9 13 9C10.7909 9 9 10.7909 9 13C9 15.2091 10.7909 17 13 17Z" fill="${_colorScheme.labelText}"/>
            </svg>
            <div id="canvas-label-text-sunshine">Text</div>

        </div>
        <div class="canvas-label-row">
            <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.6 15.3636V3.54545C9.6 1.58735 7.98823 0 6 0C4.01178 0 2.4 1.58735 2.4 3.54545V15.3636H4.8L4.8 3.54545C4.8 2.89275 5.33726 2.36363 6 2.36363C6.66274 2.36363 7.2 2.89275 7.2 3.54545L7.2 15.3636H9.6Z" fill="${_colorScheme.labelText}"/>
                <path d="M7.2 16.7472C8.59823 17.2339 9.6 18.5472 9.6 20.0909C9.6 22.049 7.98823 23.6364 6 23.6364C4.01178 23.6364 2.4 22.049 2.4 20.0909C2.4 18.5472 3.40177 17.2339 4.8 16.7472V14.3C2.06131 14.8475 0 17.2321 0 20.0909C0 23.3544 2.68629 26 6 26C9.31371 26 12 23.3544 12 20.0909C12 17.2321 9.93869 14.8475 7.2 14.3V16.7472Z" fill="${_colorScheme.labelText}"/>
                <path d="M19 2L19 22M19 22L14 17M19 22L24 17" stroke="${_colorScheme.labelText}" stroke-width="2"/>
            </svg>
            <div id="canvas-label-text-lowTemp">Text</div>
        </div>
        <div class="canvas-label-row">
            <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.6 15.3636V3.54545C9.6 1.58735 7.98823 0 6 0C4.01178 0 2.4 1.58735 2.4 3.54545V15.3636H4.8L4.8 3.54545C4.8 2.89275 5.33726 2.36363 6 2.36363C6.66274 2.36363 7.2 2.89275 7.2 3.54545L7.2 15.3636H9.6Z" fill="${_colorScheme.labelText}"/>
                <path d="M7.2 16.7472C8.59823 17.2339 9.6 18.5472 9.6 20.0909C9.6 22.049 7.98823 23.6364 6 23.6364C4.01178 23.6364 2.4 22.049 2.4 20.0909C2.4 18.5472 3.40177 17.2339 4.8 16.7472V14.3C2.06131 14.8475 0 17.2321 0 20.0909C0 23.3544 2.68629 26 6 26C9.31371 26 12 23.3544 12 20.0909C12 17.2321 9.93869 14.8475 7.2 14.3V16.7472Z" fill="${_colorScheme.labelText}"/>
                <path d="M19 24L19 3.99999M19 3.99999L24 8.99997M19 3.99999L14 8.99997" stroke="${_colorScheme.labelText}" stroke-width="2"/>
            </svg>
            <div id="canvas-label-text-highTemp">Text</div>
        </div>
    </div>
    `)
}