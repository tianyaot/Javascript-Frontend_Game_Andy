/* ------------- Winter 2024 EECS 493 Assignment 3 Starter Code ------------ */

/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5

// Game Object Helpers
let playerIsAlive=true;
let GameOn = true;
let AsteroidCanMove = true;
let DieSound = true; 
let score=0;
let scoreInterval; 
let canMove = false;
let firstgame=true;
var gameDifficulty = 'Normal'; // Default difficulty
var spawnRate = 800; // Default spawn rate
let gameLevel = 1;
let dangerLevel = 20; // Default to Normal difficulty
var asteroidSpawnInterval;
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 5;                // #pixels each time player moves by
const portalOccurrence = 15000;        // portal spawns every 15 seconds
const portalGone = 5000;               // portal disappears in 5 seconds
const shieldOccurrence = 10000;        // shield spawns every 10 seconds
const shieldGone = 5000;               // shield disappears in 5 seconds

// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

//Scoreboard Update
function ScoreIncrease() {
  scoreInterval=setInterval(function() {
      if (playerIsAlive) {
        console.log("score increase")
          score += 40;
          $('.score .value').text(score);
      }
  }, 500);
}
// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)

/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  // jQuery selectors
  game_window = $('.game-window');
  game_screen = $("#actual-game");
  asteroid_section = $('.asteroidSection');
  // hide all other pages initially except landing page
  game_screen.hide();

  /* -------------------- ASSIGNMENT 2 SELECTORS BEGIN -------------------- */
  $(document).ready(function () {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value; 
    slider.oninput = function() {
      output.innerHTML = this.value;
    };
  })
  
  $(document).ready(function() {
    $("#open-settings").click(function() { //setting container
        $(".setting-container").show();
    });
  
    $("#setting-close").click(function() {
        $(".setting-container").hide();
    });
  
    $("#open-tutorial").click(function() { //tutorial container
      if(firstgame){
        $(".tutorial-container").show();
      }else{
        //Reset all variables
        playerIsAlive = true;
        GameOn = true;
        AsteroidCanMove = true;
        DieSound = true;
        score = 0;
        gameLevel=1;

        //Adjust Game Difficulty
        adjustGameSettings(gameDifficulty);
        $('#rocket').hide();
        $('.score .value').text(score); 
        $('.level .value').text(gameLevel); 
        $('.curAsteroid').remove(); 
        $('.portal').remove(); 
        $('.shield').remove(); 
        $('#actual-game #rocket').attr('src', 'src/player/player.gif');
        game_screen.show();
        $('#GetReadyWindow').show(); 
        
        setTimeout(function() {
          canMove = true;
          $('#GetReadyWindow').hide();
          console.log("Succefully reset the rocket");
          asteroidSpawnInterval = setInterval(spawn, spawnRate);
          $('#rocket').show();
          ScoreIncrease();
          if(GameOn){
            spawnPortals();
            spawnShields();
          }  
        },3000);
      }  
  });

    $('#tutorial-close').click(function() {
          $('.tutorial-container').hide(); // hide tutorial section
          game_screen.show();     // show 'Get Ready' section
          console.log("Hello");
          adjustGameSettings(gameDifficulty);
          setTimeout(function() {
              $('#GetReadyWindow').hide(); 
              $('#rocket').css('display', 'block');
              asteroidSpawnInterval = setInterval(spawn, spawnRate);
              ScoreIncrease();     
              canMove = true; 
              if(GameOn){
                spawnPortals();
                spawnShields();
              }  
          }, 3000); 
      });
  });
  
  /* --------------------- ASSIGNMENT 2 SELECTORS END --------------------- */

  // TODO: DEFINE YOUR JQUERY SELECTORS (FOR ASSIGNMENT 3) HERE

  // Example: Spawn an asteroid that travels from one border to another
  //spawn(); // Uncomment me to test out the effect!
});


/* ---------------------------- EVENT HANDLERS ----------------------------- */
// Keydown event handler
document.onkeydown = function (event) {
  if (event.key == 'ArrowLeft') LEFT = true;
  if (event.key == 'ArrowRight') RIGHT = true;
  if (event.key == 'ArrowUp') UP = true;
  if (event.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (event) {
  if (event.key == 'ArrowLeft') LEFT = false;
  if (event.key == 'ArrowRight') RIGHT = false;
  if (event.key == 'ArrowUp') UP = false;
  if (event.key == 'ArrowDown') DOWN = false;
}

/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.difficulties button');
  document.querySelector('.difficulties button[data-difficulty="Normal"]').style.border = '2px solid yellow'; //default selected
  buttons.forEach(button => {
      button.addEventListener('click', function() {
          buttons.forEach(btn => btn.style.border = '2px solid transparent');
          this.style.border = '2px solid yellow'; //new border to be yellow
          gameDifficulty = this.getAttribute('data-difficulty');
      });
  });
});
/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */

// TODO: ADD MORE FUNCTIONS OR EVENT HANDLERS (FOR ASSIGNMENT 3) HERE

function adjustGameSettings(difficulty) {
  switch (difficulty) {
    case 'Easy':
      spawnRate = 1000;
      astProjectileSpeed = 0.5;
      dangerLevel = 10;
      break;
    case 'Normal':
      spawnRate = 800;
      astProjectileSpeed = 1.5;
      dangerLevel = 20;
      break;
    case 'Hard':
      spawnRate = 600;
      astProjectileSpeed = 2.5;
      dangerLevel = 30;
      break;
    default:
      spawnRate = 800;
      astProjectileSpeed = 1.5;
      dangerLevel = 20;
      break;
  }
  gameDifficulty = difficulty;
  $('.danger .value').text(dangerLevel); 
  clearInterval(asteroidSpawnInterval);
  //asteroidSpawnInterval = setInterval(spawn, spawnRate);
}

function spawnPortals() {
  portalSpawnInterval = setInterval(function() {
    if (!GameOn) {
      return; // Skip spawning if the game is not running
  }
      const portal = $('<div class="portal"></div>'); // Create a portal 
      RandomPosition(portal, maxPersonPosX, maxPersonPosY); 
      $('#portals').append(portal); 
      // Remove portal every 5 seconds
      setTimeout(function() { portal.remove(); }, portalGone);
  }, portalOccurrence); // Spawn a portal every 15 seconds
}

function spawnShields() {
  shieldSpawnInterval = setInterval(function() {
    if (!GameOn) {
      return; // Skip spawning if the game is not running
  }
      const shield = $('<div class="shield"></div>'); // Create a shield 
      RandomPosition(shield, maxPersonPosX, maxPersonPosY); 
      $('#shields').append(shield); // Append to the container
      // Remove shield every 5 seconds
      setTimeout(function() { shield.remove(); }, shieldGone);
  }, shieldOccurrence); // Spawn a shield every 10 seconds
}

// Position elements randomly within the game screen
function RandomPosition(element, maxX, maxY) {
  const x = Math.random()*(maxX-element.width());
  const y = Math.random()* (maxY-element.height());
  element.css({ position:'absolute', top: y+'px', left:x +'px'});
}

//Rocket
$(document).ready(function() {
  let GameArea = $('#actual-game');
  let rocket = $('#rocket');
    // Initial position 
  let startTop = GameArea.height()*0.45-rocket.height()/2;
  let startLeft = GameArea.width()*0.45-rocket.width()/2;
  rocket.css({ top: startTop + 'px', left: startLeft + 'px' });
    // Current Position
  let position = { top: startTop, left: startLeft };
  document.onkeydown=function(event) {
  switch (event.key) {
    case 'ArrowLeft':
      LEFT=true;
      break;
    case 'ArrowRight':
      RIGHT=true;
      break;
    case 'ArrowUp':
      UP=true;
      break;
    case 'ArrowDown':
      DOWN=true;
      break;
  }
  MoveRocket(); 
};

document.onkeyup=function(event) {
  switch (event.key) {
    case 'ArrowLeft':
      LEFT = false;
      break;
    case 'ArrowRight':
      RIGHT = false;
      break;
    case 'ArrowUp':
      UP = false;
      break;
    case 'ArrowDown':
      DOWN = false;
      break;
  }
  MoveRocket();
};

// Move the rocket
function MoveRocket() {
  if (!GameOn || !canMove) return; //Check if Game is still runing
  
  if (LEFT) position.left -= PERSON_SPEED;
  if (RIGHT) position.left += PERSON_SPEED;
  if (UP) position.top -= PERSON_SPEED;
  if (DOWN) position.top += PERSON_SPEED;
  
  UpdateRocketImg(); // Update the rocket's image based on the movement
}

function UpdateRocketImg() {
      // Constraint it within gameboard
      let newLeft = Math.max(0, Math.min(position.left, maxPersonPosX));
      let newTop = Math.max(0, Math.min(position.top, maxPersonPosY));
    if(hasShield){
      if (LEFT) {
        $('#rocket').attr('src', 'src/player/player_shielded_left.gif');
    } else if (RIGHT) {
        $('#rocket').attr('src', 'src/player/player_shielded_left.gif');
    } else if (UP) {
        $('#rocket').attr('src', 'src/player/player_shielded_left.gif');
    } else if (DOWN) {
        $('#rocket').attr('src', 'src/player/player_shielded_left.gif');
    } else {
        $('#rocket').attr('src', 'src/player/player_shielded.gif');
    }
  }else{
      if (LEFT) {
        $('#rocket').attr('src', 'src/player/player_left.gif');
    } else if (RIGHT) {
        $('#rocket').attr('src', 'src/player/player_right.gif');
    } else if (UP) {
        $('#rocket').attr('src', 'src/player/player_up.gif');
    } else if (DOWN) {
        $('#rocket').attr('src', 'src/player/player_down.gif');
    } else {
        $('#rocket').attr('src', 'src/player/player.gif');
    }
    }
  // Updated rocket's position
  rocket.css({
      'left': newLeft+'px',
       'top': newTop+'px'
    });
  checkCollisions(); //Check collision with shield, portal, asteroid
  }
  setInterval(MoveRocket, 5); 

function stopGame() {
  GameOn = false; 
  clearInterval(portalSpawnInterval);
  clearInterval(shieldSpawnInterval);
}

  let hasShield=false; //Check shield
function checkCollisions() {
  $('.curAsteroid').each(function() {
    let asteroid = $(this);
    if (isColliding($('#rocket'), asteroid)) {
      if (hasShield) {
        hasShield = false;
        updateRocketAppearance();
        asteroid.remove();
      } else {
        AsteroidCanMove = false;
        stopGame(); // Set GameOn to false
        endGame();
        $('#GameOver-landing').click(function() {
          $('.GameOver').hide(); // Hide Game Over screen
          $('#open-tutorial').show();
          $('#open-settings').show();
          location.reload();
      });
      }
    }
  });
}

//Audio for collecting shield
function playCollectSound() {
  document.getElementById('collectSound').play();
}

//Audio for die
function playDieSound() {
  document.getElementById('Die').play();
}

// Adjust volume of sound
document.getElementById("myRange").addEventListener("input", function() {
  var volume = this.value / 100; 
  document.getElementById("collectSound").volume = volume;
  document.getElementById("Die").volume = volume;
  document.getElementById("demo").innerText = this.value;
});

function CheckShields() {
  $('.shield').each(function() {
    if (isColliding($('#rocket'), $(this))) {
      hasShield = true; // Rocket obtains a shield
      updateRocketAppearance();
      $(this).remove(); // Remove shield
      playCollectSound();
    }
  });
}

function updateRocketAppearance() {
  if (hasShield) {
      $('#rocket').attr('src', 'src/player/player_shielded.gif'); 
  } else {
      $('#rocket').attr('src', 'src/player/player.gif'); 
  }
}

function CheckPortal() {
  $('.portal').each(function() {
    let portal = $(this);
    if (isColliding($('#rocket'), portal)) {
      playCollectSound(); // Play the collect sound
      portal.remove();
      handlePortalCollision();
    }
  });
}

function handlePortalCollision() {
  gameLevel += 1;
  astProjectileSpeed += 0.5;
  dangerLevel += 2;
  UpdateScore(); //Increase the level && danger under ScoreBoard
}

function UpdateScore() {
  console.log("Checking for portals");
  $('.level .value').text(gameLevel);
  $('.danger .value').text(dangerLevel);
}

function endGame() {
  console.log("Game Over!");
  firstgame=false;
  if(DieSound){
    playDieSound();
    DieSound=false;
  }
  $('#rocket').attr('src', 'src/player/player_touched.gif'); // Touched Image Gif

  playerIsAlive = false; // Mark the player as not alive
  GameOn = false; // Stops game 
  clearInterval(scoreInterval);
  clearInterval(asteroidSpawnInterval);
  setTimeout(function() {
    //console.log("gameover page shows");
    game_screen.hide();
    $('#open-tutorial').hide();
    $('#open-settings').hide();
    $('#landing_page').show();
    $('.GameOver').show();
  }, 2000);
  }

  setInterval(function() {
    checkCollisions();
    CheckShields();
    CheckPortal();
}, 10);
});





/* ---------------------------- GAME FUNCTIONS ----------------------------- */
// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid, where it should move
    this.x_dest = 0;
    this.y_dest = 0; 
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  if (!GameOn) {
    return; // Skip updating position if the game is not running
  }
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update Asteroid position on screen
    if(AsteroidCanMove){
      asteroid.updatePosition();
    }
    if (!GameOn) {
      return; // Skip spawning if the game is not running
  }
    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game boarder
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}

