function EventHandler() {

    var self = {
        events: {},
        on: on,
        emit: emit
    };

    return self;

    function emit( eventNames, options ) {
        if ( typeof eventNames !== 'string' ) {
            throw Error( 'First argument of EventHandler.emit must be a string of event names split by spaces' );
        }

        var split = eventNames.split( /\s+/ );

        if ( split.length > 1 ) {
            split.forEach( function ( eventName ) {
                emit( eventName, options )
            } );
            return;
        }

        var eventName = eventNames;

        if ( ! self.events[ eventName ] ) {
            return;
        }

        self.events[ eventName ].forEach( function ( fn ) {
            fn( options );
        } );
    }

    function on( eventNames, fn ) {
        if ( typeof fn !== 'function' ) {
            throw Error( 'Second parameter of EventHandler.on must be a function' );
        }

        var split = eventNames.split( /\s+/ );
        if ( split.length > 1 ) {
            split.forEach( function ( eventName ) {
                on( eventName, fn );
            } );
            return;
        }

        var eventName = eventNames;

        if ( ! self.events[ eventName ] ) {
            self.events[ eventName ] = [];
        }

        self.events[ eventName ].push( fn );
    }
}
