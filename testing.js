( function () {

    'use strict';

    var container = document.querySelector( '.CropArea' );
    var cropArea = document.querySelector( '.CropArea-area' );
    var handle = document.querySelector( '.CropArea-handle' );

    console.log( 'started!' );

    setInterval( () => console.log( el( cropArea ).width() / el( container ).width() * 100 > 80 ),1000 );

    var cropAreaDraggable = makeDraggable( cropArea, container, {
        x: {
            largest: () => 100 - el( cropArea ).width() / el( container ).width() * 100,
            smallest: () => 0,
        },
        y: {
            largest: () => 100 - el( cropArea ).height() / el( container ).height() * 100,
            smallest: () => 0,
        },
        affects: [
            {
                element: handle,
                x: {
                    left: {
                        add: [
                            'middle.bounds.right',
                        ],
                        subtract: [
                            'middle.container.bounds.left',
                            () => el( handle ).width() / 2
                        ],
                    }
                },
                y: {
                    top: {
                        add: [
                            'middle.bounds.bottom'
                        ],
                        subtract: [
                            'middle.container.bounds.top',
                            () => el( handle ).height() / 2
                        ]
                    }
                }
            }
        ]
    } );

    var handleDraggable = makeDraggable( handle, container, {
        x: {
            smallest: () => 0 - el( handle ).width() / 2 / el( container ).width() * 100,
            largest: () => 100 - el( handle ).width() / 2 / el( container ).width() * 100,
            fromY: ( y ) => y * 1.8,
        },
        y: {
            smallest: () => 0 - el( handle ).height() / 2 / el( container ).height() * 100,
            largest: () => 100 - el( handle ).height() / 2 / el( container ).height() * 100,
        },
        affects: [
            {
                element: cropArea,
                x: {
                    width: {
                        add: [
                            'middle.bounds.left',
                            () => el( handle ).width() / 2
                        ],
                        subtract: [
                            () => el( cropArea ).bounds().left
                        ]
                    }
                },
                y: {
                    height: {
                        add: [
                            'middle.bounds.top',
                            () => el( handle ).height() / 2
                        ],
                        subtract: [
                            () => el( cropArea ).bounds().top
                        ]
                    }
                }
            }
        ]
    } );

    setInterval( () => {
        console.log( 'cropAreaDraggable l/r:', cropAreaDraggable.left(), cropAreaDraggable.top() );
    }, 1000 );

} )();
