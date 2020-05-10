class Element {
    constructor(x, y, type, others){
        this.x = x
        this.y = y
        this.type = type
        this.others = others
    }
}

export class CanvasElement extends Element {
    constructor(x, y, type, others) {
        super(x, y, type, others)
    }

    render(avCtx){
        
    }
}

export class ThreeElement extends Element {
    constructor(x, y, type, others) {
        super(x, y, type, others)
    }

    render(avCtx){
        
    }
}