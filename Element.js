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

    render(){
        
    }
}

export class Canvas2DElement extends Element {
    constructor(x, y, type, theme, audio, frequencyData, onClick, onKeys, canvas2D) {
        super(x, y, type, theme, audio, frequencyData, onClick, onKeys);
        this.canvas2D = canvas2D;
    }

    render(){
        
    }
}


export class ThreeElement extends Element {
    constructor(x, y, type, theme, audio, frequencyData, onClick, onKeys, three) {
        super(x, y, type, theme, audio, frequencyData, onClick, onKeys);
        this.three = three;
    }
}