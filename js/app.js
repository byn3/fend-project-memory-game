//Begin and initialize the game via start and the global variables
start();
let numOfMoves = 0;
let flipped = [];
let timer = 0;
stars = document.getElementsByClassName('fa-star');
//create timer global variable which will be used later to stop timer. updates every second.
timerFunction = setInterval(function() {
    timer += 1;
    $('.time').text(timer);
}, 1000);

/**
 * @description Displays cards and shuffles list of cards shuffle the list of cards using the shuffle function below
 * No parameters or return values. This function just loops through each card and created its HTML
 */
function start() {
//each of these symbols is just a font awesome icon, hence the fa- + icon concatenation in the for loop
    const symbols = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb']
    let shuffled = shuffle(symbols);
    let deck = document.getElementsByClassName('deck')[0];
    for (let i = 0; i <= 15; i += 1){
        deck.innerHTML += '<li class="card"><i class="fa fa-' + shuffled[i] + '"></i></li>';
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976.
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/**
* This was used to help test my CODE. To use this, uncomment the HTML autowin code.
* This was so helpful with debugging my win scenarios since to check if everything works, I had to play the game and actually win.
$('.autowin').click(function() {
    flipped.length = 16;
    clearInterval(timerFunction);
 });
*/

/**
* @description THE MEAT OF THE CODE. If the card is clicked, do stuff.
* Only if it hasn't been opened or if it is a match, then be interactive.
* Add the show and open classes. Add that card to the stack. Increase #ofMoves. Update #ofMoves HTML.
* Run the starCheck program to see if we derank from 3 to 2 stars or 2 to 1 star.
* If we have an even number of flipped cards, run card check,
* As well as set a 1 second timer so the user can't speed click everything.
*/
$('.card').click(function() {
    if(!($(this).hasClass('open') || $(this).hasClass('match')) && $('.open').length < 2) {
        $(this).addClass('show');
        $(this).addClass('open');
        flipped.push($(this));
        numOfMoves += 1;
        $('.numOfMoves').text(numOfMoves);
        starCheck();
        if (flipped.length % 2 == 0)  {
            setTimeout(cardsCheck, 1000);
        }
    }
});

//check if icons match on the cards. manipulates classes to achieve css goal.
function cardsCheck() {
    if (flipped[flipped.length - 2].html() == flipped[flipped.length - 1].html()) {
        flipped[flipped.length - 2].removeClass('open');
        flipped[flipped.length - 1].removeClass('open');
        flipped[flipped.length - 2].addClass('matched');
        flipped[flipped.length - 1].addClass('matched');
    } else {
        flipped[flipped.length - 2].removeClass('open');
        flipped[flipped.length - 2].removeClass('show');
        flipped[flipped.length - 1].removeClass('open');
        flipped[flipped.length - 1].removeClass('show');
        flipped.pop(); //LIFO
        flipped.pop();
    }
    //win checker, if flipped array contain 16 cards, winner winner chicken dinner.
    if (flipped.length == 16) {
        //set stars and stop the timer
        stars = document.getElementsByClassName('fa-star').length;
        clearInterval(timerFunction);
        //call on sweetalerts2
        swal({
            title: 'GG! You won!',
            text: 'It took you ' + timer + ' seconds to match all 16 cards! You got ' + stars + ' star(s) with ' + numOfMoves + ' moves.',
            icon: 'success',
            button: 'Replay',
            closeOnEsc: false,
            allowOutsideClick: false,
        }).then(function(isConfirm) {
            if (isConfirm) {
                // handles Confirm button click
                window.location.reload();
            }
          }).catch(swal.noop) // handles the no call but this might be depreciated...

    }
}

/**
* @description just checks if the number of moves has incremented past this range.
* if so we decreast the stars by changing the font awesome to an empty star symbol.
*/
function starCheck() {
    if (numOfMoves == 21) {
        stars[2].classList.add('fa-star-o');
        stars[2].classList.remove('fa-star');
    }
    else if (numOfMoves == 39) {
        stars[1].classList.add('fa-star-o');
        stars[1].classList.remove('fa-star');
    }
}
