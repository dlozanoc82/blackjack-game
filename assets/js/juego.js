const miModulo = (() => {
    'use strict';

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
             especiales = ['A', 'J', 'Q', 'K'];

    // let puntosJugador = 0, puntosPC = 0;
        let puntosJugadores = [];


    //REFERENCIAS AL HTML
    const btnPedirCarta = document.querySelector('#btnPedirCarta'),
             btnDetener = document.querySelector('#btnDetener'),
             btnNuevoJuego = document.querySelector('#btnNuevoJuego');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
             puntosHTML = document.querySelectorAll('small');


    //Se encarga de iniciar el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
      
        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = ' ');

        btnPedirCarta.disabled = false;
        btnDetener.disabled = false;
    }


    //ESTA FUNCION CREA UNA NUEVA BARAJA
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++){
            for (let tipo of tipos) {
            deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
            deck.push(esp + tipo);
            }
        }
        return  _.shuffle( deck );
    }

    //ESTA FUNCIÓN PIDE UNA CARTA
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'No hay cartas en la Baraja';
        }

        return  deck.pop();

    }

    //ESTA FUNCION DA EL VALOR A LA CARTA
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length-1);
        return (isNaN(valor)) ? 
                    (valor === 'A') ? 11 : 10
                    : valor*1 ;
    }

    //ACUMULAR PUNTOS
    const acumularPuntos = ( turno, carta ) =>{
        
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];

    }

    //CREAR CARTA EN EL HTML
    const crearCartaHTML = ( carta, turno) => {
        const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${ carta }.png`;
            imgCarta.classList.add('carta');
            divCartasJugadores[turno].append( imgCarta );
    }

    const mensajes = () => {
        
        const [puntosMinimos, puntosPC] = puntosJugadores;
        
        setTimeout(() => {

            if ( puntosPC === puntosMinimos ) {
            alert('Nadie Gana :c');
            }else if (puntosMinimos>21){
            alert('La computadora gana');
            }else if( puntosPC >21 ){
            alert('Jugador Gana')
            }else{
            alert('Computadora Gana');
            }

        }, 100 );
    }

    //TURNO DE LA COMPUTADORA
    const turnoPC = ( puntosMinimos ) => {

        let puntosPC = 0;

        do {
            const carta = pedirCarta();
            puntosPC = acumularPuntos( puntosJugadores.length - 1, carta );
            crearCartaHTML( carta, puntosJugadores.length - 1 );
            
        } while ( (puntosPC < puntosMinimos) && (puntosMinimos <= 21) );

      mensajes();

    }


    //EVENTOS
    btnPedirCarta.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( 0, carta );
        
        crearCartaHTML(carta, 0);

        if ( puntosJugador > 21 ) {
        
            console.warn('Lo siento mucho, perdiste');
            btnPedirCarta.disabled = true;
            btnDetener.disabled = true;
            turnoPC( puntosJugador );

        }else if ( puntosJugador === 21 ){
        
            console.warn('21, genial');
            btnPedirCarta.disabled = true;
            btnDetener.disabled = true;
            turnoPC( puntosJugador );
        }

    });


    //DETENER
    btnDetener.addEventListener('click', () =>{
        btnPedirCarta.disabled = true;
        btnDetener.disabled = true;
        turnoPC( puntosJugadores[0] );
    })


    btnNuevoJuego.addEventListener('click', () => {
        inicializarJuego();
    })
    
    return {
        nuevoJuego: inicializarJuego
    };

})( );



