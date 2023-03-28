import { Country, ContourObject, HoverAnimation} from './types.js'
import { createLabel, COLOURSLIGHT, ViewTypes, createSelectItems } from './config.js'

export class Controller {
    countryList: Map<string, Country>;
    staticObjectList: Map<string, ContourObject>
    labelContainer: JQuery<HTMLElement>;
    labelList: Map<string, Label>
    lastActive: string;

    canvasHeightTranslation: number;
    canvasWidthTranslation: number;
    canvasScaleFactorX: number;
    canvasScaleFactorY: number;

    viewActive: number;

    managerChangeCallback: (_active: string) => void;

    activeChangeCallback(_active: string) {
        if (_active == this.lastActive) return;
        this.lastActive = _active;
        // pass message to manager.
        this.managerChangeCallback(_active)
    }

    handleHoverAnimations(_ctry: Country) {
        let shade = 12;  

        if (_ctry.hover == true && _ctry.active == false) {
            if(_ctry.animationMap.has('hoverReverse')) {
                // shade = shade - Math.abs(_ctry.animationMap.get('hoverReverse').endAnimation());
                _ctry.animationMap.delete('hoverReverse')
            }
            // console.log(shade)
            if (!_ctry.animationMap.has('hover')) {
                let startFill = {
                    r: _ctry.rootFill.r - shade,
                    g: _ctry.rootFill.g - shade,
                    b: _ctry.rootFill.b - shade
                }
                let animation = new HoverAnimation(_ctry,'hover',255,startFill,shade)
                _ctry.animationMap.set('hover', animation);
            }
        } else {
            if(_ctry.animationMap.has('hover')) {
                shade = -_ctry.animationMap.get('hover').endAnimation();
                _ctry.animationMap.delete('hover')


                if (!_ctry.animationMap.has('hoverReverse')) {
                    let startFill = {
                        r: _ctry.rootFill.r + shade,
                        g: _ctry.rootFill.g + shade,
                        b: _ctry.rootFill.b + shade
                    }
                    let animation = new HoverAnimation(_ctry,'hoverReverse',255,startFill,shade)
                    _ctry.animationMap.set('hoverReverse', animation);
                }
            }
        }
    }

    viewChange(_view: number) {
        if(this.viewActive == _view) return;
        this.viewActive = _view;
        this.renderSelectBarLabels();
    }

    checkLabelOwnerExists(_labelName: string): boolean {
        for (let key of this.countryList.keys()) {
            if (_labelName == key) return true;
        }
        return false;
    }

    setupLabels(_labelConfig: object): void {
        for (let config in Object.entries(_labelConfig)) {
            let info = Object.values(_labelConfig)[config]
            if (!this.checkLabelOwnerExists(info.owner)) continue;
            
            let element: JQuery<HTMLElement> = createLabel(COLOURSLIGHT)
            let country: Country = this.countryList.get(info.owner);

            element.find('#canvas-label-title').text(info.title)

            let label: Label = {
                content: element,
                offsetX: info.offset[0],
                offsetY: info.offset[1]
            }

            label.content.on('mouseenter', (e: JQuery.Event) => {
                country.hoverLock = true;
                country.hover = true;
                this.handleHoverAnimations(country)
            }) 
            
            label.content.on('mouseleave', (e: JQuery.Event) => {
                country.hoverLock = false;
            })

            label.content.on('click', (e: JQuery.Event) => {
                country.active = true;
            })

            this.labelList.set(info.owner, label)
        }
    }

    updateCanvasAttributes(_scaleFactorX: number, _scaleFactorY: number, _widthTranslation: number, _heightTranslation: number) {
        this.canvasScaleFactorX = _scaleFactorX;
        this.canvasScaleFactorY = _scaleFactorY;
        this.canvasHeightTranslation = _heightTranslation;
        this.canvasWidthTranslation = _widthTranslation;
    }


    positionLabels(): void {
        for (let [key, label] of this.labelList.entries()) {
            if (!this.checkLabelOwnerExists(key)) continue;

            label.content.css({
                "top": this.canvasHeightTranslation + (label.offsetY * this.canvasScaleFactorY),
                "left": this.canvasWidthTranslation + (label.offsetX * this.canvasScaleFactorX)
            })
        }

    }

    renderLabels() {
        this.labelList.forEach((obj, key) => {
            obj.content.appendTo(this.labelContainer)
        })


    }
    
    renderSelectBarLabels() {
        let selectBar = this.labelContainer.find('#canvas-label-select-bar')
        if(!selectBar) return;
        selectBar.empty()
        for(let key = 0; key < Object.entries(ViewTypes).length; key++) {
            let element: JQuery<HTMLElement> = createSelectItems(Object.entries(ViewTypes)[key][0], COLOURSLIGHT);            
            
            if(key == this.viewActive) {
                element.addClass("canvas-label-select-bar-item-active")
                element.find('.canvas-label-select-bar-dropdown').show()
            } else {
                element.on('click', (e: JQuery.Event) => {
                    this.viewChange(key)
                })
                element.find('.canvas-label-select-bar-dropdown').hide()
            }
            
            element.appendTo(selectBar);
        }
    }

    constructor(_objects: { ctryList: Map<string, Country>, staticObjList: Map<string, ContourObject> },
        _labelContainer: JQuery<HTMLElement>,
        _scaleFactorX: number,
        _scaleFactorY: number,
        _widthTranslation: number,
        _heightTranslation: number
    ) {
        this.countryList = _objects.ctryList;
        this.staticObjectList = _objects.staticObjList;
        
        this.labelContainer = _labelContainer;
        this.labelList = new Map();
        this.lastActive = undefined;
        

        this.updateCanvasAttributes(_scaleFactorX, _scaleFactorY, _widthTranslation, _heightTranslation);

        this.viewActive = ViewTypes.highTemp
    }
}

type Label = {
    content: JQuery<HTMLElement>,
    offsetX: number,
    offsetY: number
}