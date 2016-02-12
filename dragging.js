var log = console.log;

( function () {
    'use strict';

    window.makeDraggable = function makeDraggable( element, container, options ) {

        // Event handler
        // -------------

        var events = EventHandler();

        // Model
        // -----

        var model = {
            start: {
                clientX: 0,
                clientY: 0,
                bounds: {},
                container: {
                    bounds: {}
                }
            },
            middle: {
                clientX: 0,
                clientY: 0,
                bounds: {},
                container: {
                    bounds: {}
                }
            },
            end: {
                clientX: 0,
                clientY: 0,
                bounds: {},
                container: {
                    bounds: {}
                }
            }
        };

        // Add event listeners
        // -------------------

        // Custom events

        options.affects.forEach( function ( affected ) {
            events.on( 'update:complete', function () { affect( affected ) } );
            events.on( 'end:complete', function () { affect( affected ) } );
            events.on( 'initialize:complete', function () { affect( affected ) } );
        } );

        events.on( 'middle:complete', function () {
            update();
        } );

        events.on( 'initialize:complete', function () {
            console.log( model );
        } );

        // Browser events

        el( document ).on( 'DOMContentLoaded', function ( event ) {
            setModel( 'middle', event );
            events.emit( 'initialize:complete' );
        } );

        el( element ).on( 'mousedown', start );

        // Event listeners
        // ---------------

        function start( event ) {
            setModel( 'start', event );

            el( window ).on( 'mousemove', middle );
            el( window ).on( 'mouseup', end );
            el( window ).on( 'mouseleave', end );

            events.emit( 'start:complete' );
        }

        function middle( event ) {
            if ( event.clientX || event.clientY )
                setModel( 'middle', event );

            events.emit( 'middle:complete' );
        }

        function end( event ) {
            setModel( 'end', event );

            el( window ).off( 'mousemove', middle );
            el( window ).off( 'mouseup', end );
            el( window ).off( 'mouseleave', end );

            events.emit( 'end:complete' );
        }

        // Implementation
        // --------------

        var calculate = {
            top: function () {

                if ( options.y.preserveCondition && options.y.preserveCondition() ) {
                    return options.y.preserveCondition.previous;
                }

                if ( options.y.fromX ) {
                    return options.y.fromX( this.left() );
                }

                var value = (
                    ( this.px.top() - this.px.inner.top() )
                    / model.middle.container.height
                ) * 100;

                if ( value < options.y.smallest() ) value = options.y.smallest();
                if ( value > options.y.largest() ) value = options.y.largest();

                if ( isNaN( value ) )
                    value = 0;

                if ( options.y.preserveCondition )
                    options.y.preserveCondition.previous = value;

                return value;
            },
            left: function () {

                if ( options.x.preserveCondition && options.x.preserveCondition() ) {
                    return options.x.preserveCondition.previous;
                }

                if ( options.x.fromY ) {
                    return options.x.fromY( this.top() );
                }

                var value = (
                    ( this.px.left() - this.px.inner.left() )
                    / el( container ).width()
                ) * 100;

                if ( value < options.x.smallest() ) value = options.x.smallest();
                if ( value > options.x.largest() ) value = options.x.largest();

                if ( isNaN( value ) )
                    value = 0;

                if ( options.x.preserveCondition )
                    options.x.preserveCondition.previous = value;

                return value;
            },
            px: {
                top: function () {
                    return (
                        model.middle.clientY - model.middle.container.bounds.top
                    );
                },
                left: function () {
                    return (
                        model.middle.clientX - model.middle.container.bounds.left
                    );
                },
                inner: {
                    top: function () {
                        return model.start.clientY - model.start.bounds.top;
                    },
                    left: function () {
                        return model.start.clientX - model.start.bounds.left;
                    }
                }
            }
        }

        function setModel( when, event ) {
            model[ when ].clientX = event.clientX;
            model[ when ].clientY = event.clientY;
            model[ when ].bounds = el( element ).bounds();
            model[ when ].container.bounds = el( container ).bounds();
            model[ when ].container.height = el( container ).height();
            model[ when ].container.width = el( container ).width();
        }

        function update() {

            el( element ).css( 'top', calculate.top() + '%' );
            el( element ).css( 'left', calculate.left() + '%' );

            events.emit( 'update:complete' );
        }

        function affect( affected ) {
            if ( affected.x ) {
                if ( affected.x ) {
                    for ( var key in affected.x ) {
                        if ( ! affected.x.hasOwnProperty( key ) )
                            continue;

                        var result = 0;
                        var addProperties = affected.x[ key ].add || [];
                        var subtractProperties = affected.x[ key ].subtract || [];

                        addProperties.forEach( function ( property ) {
                            result += parseExpression( model, property );
                        } );

                        subtractProperties.forEach( function ( property ) {
                            result -= parseExpression( model, property );
                        } );

                        result = result / model.middle.container.width * 100;

                        el( affected.element ).css( key, result + '%' );
                    }
                }
                if ( affected.y ) {
                    for ( var key in affected.y ) {
                        if ( ! affected.y.hasOwnProperty( key ) )
                            continue;

                        var result = 0;
                        var addProperties = affected.y[ key ].add || [];
                        var subtractProperties = affected.y[ key ].subtract || [];

                        addProperties.forEach( function ( property ) {
                            result += parseExpression( model, property );
                        } );

                        subtractProperties.forEach( function ( property ) {
                            result -= parseExpression( model, property );
                        } );

                        result = result / model.middle.container.height * 100;

                        el( affected.element ).css( key, result + '%' );
                    }
                }
            }
        }

        // Return values
        // -------------

        return calculate;
    }

} )();

function parseExpression( object, expression ) {

    if ( typeof expression === 'function' ) {
        return expression();
    }

    var current = object;

    var split = expression.split( '.' );

    split.forEach( function ( sub ) {
        current = current[ sub ];
    } );

    return current;
}

function mapTrim( array ) {
    array.forEach( function ( item, index ) {
        array[ index ] = item.trim();
    } );

    return array;
}
