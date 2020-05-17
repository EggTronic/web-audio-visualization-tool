class Ripple {
    constructor(options = {}) {
        const defaultOptions = {
            size: 500,
            radius: 100,
            interval: [500, 1500],
            width: 4,
            color: '#fff',
            opacity: 1
        };

        this.options = Object.assign(defaultOptions, options);
        this.radius = this.options.radius < 1 ? this.options.size * this.options.radius : this.options.radius
        this.opacity = 1;
        this.center = this.options.size / 2;  // mid point
        this.rate = 0;  // frame per seconds
        this.minInterval = 10; 
        this.rippleLines = [];  // store array of ripple radius
    }

    strokeRipple() {
        // remove ripples that goes out of the container
        if (this.rippleLines[0] > this.options.size) {
            this.rippleLines.shift();
        }

        // create new ripple
        if (this.rate - this.lastripple >= this.minInterval) {
            this.rippleLines.push({
                r: this.radius + this.options.rippleWidth / 2,
                o: this.o - this.options.rippleWidth / 2,
                color: this.options.rippleColor
            })

            // update time
            this.lastripple = this.rate
        }

        // calculate next ripple
        this.rippleLines = this.rippleLines.map((line, index) => {
            
        })
    }

    render() {
        this.strokeRipple()
    }
}