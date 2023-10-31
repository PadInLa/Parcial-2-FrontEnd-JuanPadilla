class Game {
  constructor() {
    this.isWrongCount = 0;
    this.TilesArray = [];

    this.initializeGame = function () {
      let rArray = Array.from({ length: 15 }, (_, i) => i + 1);
      RandomSort(rArray);

      do {
        rArray = RandomSort(rArray);
      } while (!this.isSolvable(rArray));

      for (let i = 0; i < 15; i++) {
        const TileNumber = i + 1;
        const posX = Math.floor(i / 4) + 1;
        const posY = (i % 4) + 1;
        const rightPosX = Math.floor((rArray[i] - 1) / 4) + 1;
        const rightPosY = ((rArray[i] - 1) % 4) + 1;

        const isCorrectPosition = posX === rightPosX && posY === rightPosY;

        this.TilesArray[i] = new Tile(
          TileNumber,
          posX,
          posY,
          rightPosX,
          rightPosY,
          isCorrectPosition
        );

        if (!isCorrectPosition) {
          this.isWrongCount++;
        }
      }

      this.TilesArray[15] = new Tile(16, 4, 4, 4, 4);
    };

    this.isSolvable = function (random_array) {
      var control_sum = 0;
      var length = random_array.length;

      for (var i = 0; i < length; i++) {
        for (var j = i + 1; j < length; j++) {
          if (random_array[j] < random_array[i]) {
            control_sum++;
          }
        }
      }
      return control_sum % 2 === 0;
    };

    this.drawBoard = function (pixel_size) {
      const gameBoard = document.createElement("section");
      gameBoard.id = "board";
      gameBoard.style.height = pixel_size + "px";
      gameBoard.style.width = pixel_size + "px";

      const TileContainer = document.createElement("section");

      gameBoard.appendChild(TileContainer);

      document.body.appendChild(gameBoard);

      for (let i = 0; i < 15; i++) {
        const gameTile = document.createElement("div");
        gameTile.classList.add("tile");
        gameTile.style.top = (this.TilesArray[i].posX - 1) * 25 + "%";
        gameTile.style.left = (this.TilesArray[i].posY - 1) * 25 + "%";

        const numberContainer = document.createElement("div");
        numberContainer.classList.add("container");
        numberContainer.textContent = this.TilesArray[i].value;

        gameTile.appendChild(numberContainer);
        TileContainer.appendChild(gameTile);
      }
    };

    this.checkPosition = function (Tile) {
      const isCorrectPosition =
        Tile.posX === Tile.rightPosX && Tile.posY === Tile.rightPosY;

      if (Tile.isRightPosition !== isCorrectPosition) {
        Tile.isRightPosition = isCorrectPosition;

        if (isCorrectPosition) {
          this.isWrongCount--;
        } else {
          this.isWrongCount++;
        }
      }
    };

    this.moveTile = function (Tile_number) {
      const Tile = this.TilesArray[Tile_number - 1];
      const emptyTile = this.TilesArray[15];

      const test_posX = Tile.posX - emptyTile.posX;
      const test_posY = Tile.posY - emptyTile.posY;

      if (Math.abs(test_posX) + Math.abs(test_posY) !== 1) {
        return false;
      }

      [Tile.posX, emptyTile.posX] = [emptyTile.posX, Tile.posX];
      [Tile.posY, emptyTile.posY] = [emptyTile.posY, Tile.posY];

      this.checkPosition(Tile);

      return true;
    };

    this.checkGame = function () {
      if (this.isWrongCount == 0) return true;
      else return false;
    };
  }
}

class Tile {
  constructor(value, rightPosX, rightPosY, posX, posY) {
    this.value = value;
    this.isRightPosition = false;
    this.posX = posX;
    this.posY = posY;
    this.rightPosX = rightPosX;
    this.rightPosY = rightPosY;
  }
}

function RandomSort(array) {
  var length = array.length;
  var aux, randomPos;

  for (var i = 0; i < length; i++) {
    randomPos = i + Math.floor(Math.random() * (length - i));
    aux = array[i];
    array[i] = array[randomPos];
    array[randomPos] = aux;
  }

  return array;
}

document.addEventListener("DOMContentLoaded", function () {
  const game = new Game();
  game.initializeGame();
  game.drawBoard(500);

  const gameTileElements = document.querySelectorAll(".tile");
  gameTileElements.forEach(function (TileElement) {
    TileElement.addEventListener("click", function () {
      const TileNumber = TileElement.querySelector("div").textContent;
      if (game.moveTile(TileNumber)) {
        TileElement.style.transition =
          "top 0.3s, left 0.3s, background-color 0.1s ease-in-out";
        TileElement.style.top =
          (game.TilesArray[TileNumber - 1].posX - 1) * 25 + "%";
        TileElement.style.left =
          (game.TilesArray[TileNumber - 1].posY - 1) * 25 + "%";
      }
      if (game.checkGame()) {
        document.getElementById("msg").textContent = "Usted ha ganado!";
      }
    });
  });
});
