( function () {

    'use strict';

    var container = document.querySelector( '.CropArea' );
    var cropArea = document.querySelector( '.CropArea-area' );
    var handle = document.querySelector( '.CropArea-handle' );

    var cropAreaWidth = () => el( cropArea ).width() / el( container ).width() * 100;
    var cropAreaHeight = () => el( cropArea ).height() / el( container ).height() * 100;

    console.log( 'started!' );

    var cropAreaDraggable = makeDraggable( cropArea, container, {
        x: {
            largest: () => 100 - cropAreaWidth(),
            smallest: () => 0,
        },
        y: {
            largest: () => 100 - cropAreaHeight(),
            smallest: () => 0,
        }
    } );

    var aspectRatio = 1.8;

    // x/y = a
    // x = a*y
    // y/x = 1/a
    // y = x/a

    var handleWidth = () => el( handle ).width() / el( container ).width() * 100;
    var handleHeight = () => el( handle ).height() / el( container ).height() * 100;

    var handleDraggable = makeDraggable( handle, container, {
        x: {
            smallest: () => 0 - handleWidth() / 2,
            largest: () => 100 - handleWidth() / 2,
            fromY: ( y ) => {
                console.log( y );
                return aspectRatio * ( y - el( handle ) )
            },
            callback: ( x ) => (
                x
            ),
        },
        y: {
            smallest: () => 0 - handleHeight() / 2,
            largest: () => {
                return 100 - handleHeight() / 2
            },
            callback: ( y ) => {

                /*

                var maxBounds = (
                    (
                        el( handle ).bounds().left
                        + el( handle ).width() / 2
                        - el( container ).bounds().left
                    ) / el( container ).width * 100
                );

                var withinBounds = maxBounds < 100;

                if ( withinBounds ) {
                    return y;
                } else {
                    console.log( 'Outside of bounds' );
                    return (
                        el( cropArea ).bounds().top
                        + ( el( cropArea ).width() / aspectRatio )
                    ) / el( container ).height() * 100;
                }

                */

                return y;
            },
        }
    } );

    handleDraggable.on( 'move', function () {
        // Resize cropArea
        var newWidth = (
            el( handle ).bounds().left
            - el( cropArea ).bounds().left
            + el( handle ).width() / 2
        ) / el( container ).width() * 100;
        var newHeight = (
            el( handle ).bounds().top
            - el( cropArea ).bounds().top
            + el( handle ).height() / 2
        ) / el( container ).height() * 100;

        el( cropArea ).css( 'width', newWidth + '%' );
        el( cropArea ).css( 'height', newHeight + '%' );
    } );

    cropAreaDraggable.on( 'move', function () {

        // Move handle
        var newLeft = (
            el( cropArea ).bounds().right
            - el( container ).bounds().left
            - el( handle ).width() / 2
        ) / el( container ).width() * 100;

        var newTop = (
            el( cropArea ).bounds().bottom
            - el( container ).bounds().top
            - el( handle ).width() / 2
        ) / el( container ).height() * 100;

        el( handle ).css( 'left', newLeft + '%' );
        el( handle ).css( 'top', newTop + '%' );

    } );

} )();
