function el( element ) {
    return {
        css: function ( key, value ) {
            element.style[ key ] = value;
        },
        on: function ( event, listener ) {
            element.addEventListener( event, listener );
            return function () {
                off( event, listener );
            }
        },
        off: function ( event, listener ) {
            element.removeEventListener( event, listener );
        },
        bounds: function () {
            return element.getBoundingClientRect();
        },
        height: function () {
            return this.bounds().bottom - this.bounds().top;
        },
        width: function () {
            return this.bounds().right - this.bounds().left;
        }
    };
}
