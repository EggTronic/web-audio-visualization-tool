class Element {
    constructor(x, y, type, theme, audio, frequencyData, onClick, onKeys){
        this.x = x;
        this.y = y;
        this.type = type;
        this.theme = theme;
        this.audio = audio;
        this.frequencyData = frequencyData;
        this.handleClick = onClick;
        this.handleKeys = onKeys;
    }

    _init() {
        // check event type
        // iterate events to bind
        // return functions to un-subscribe events
    }
}

export class CanvasElement extends Element {
    constructor(x, y, type, theme, audio, frequencyData, onClick, onKeys, canvas) {
        super(x, y, type, theme, audio, frequencyData, onClick, onKeys);
        this.canvas = canvas;
    }

    render(){
        
    }
}

export class ThreeElement extends Element {
    constructor(x, y, type, others) {
        super(x, y, type, others);
    }

    render(canvas, audio, frequencyData){
        
    }
}