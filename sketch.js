class Board {
  constructor(px, py, is_player) {
    this.pos_x = px;
    this.pos_y = py;
    this.is_player = is_player;
    this.init();
  }

  count_select(selectVal) {
    if (this.is_player) {
      print(
        "c:count_select(" +
          selectVal +
          ")============================================"
      );
    } else {
      print(
        "p:count_select(" +
          selectVal +
          ")============================================"
      );
    }

    let ni = 0;
    for (let j = 0; j < this.hor_line; j++) {
      for (let i = 0; i < this.ver_line; i++) {
        if (selectVal == this.numbers[ni]) {
          this.jcnt[j]++;
          this.icnt[i]++;
          if (i == j) {
            this.ltrcnt++;
          }
          if (i + j == 4) {
            this.rtlcnt++;
          }
          return;
        }
        ni++;
      }
    }
  }

  debug() {
    print(this.jcnt);
    print(this.icnt);
    print(this.ltrcnt);
    print(this.rtlcnt);
  }

  init() {
    this.icnt = [0, 0, 0, 0, 0];
    this.jcnt = [0, 0, 0, 0, 0];
    this.ltrcnt = 0;
    this.rtlcnt = 0;
    this.hor_line = 5;
    this.ver_line = 5;
    this.cell_size = 30;
    this.numbers = [];
    this.mask = []; // for numbers

    while (this.numbers.length < 25) {
      var r = int(random(1, 26));
      if (this.numbers.indexOf(r) == -1) {
        // 沒有出現過的數字 ==> xx.indexOf(?) ==> -1
        this.numbers.push(r);
        this.mask.push(true);
        //print('ok'+this.numbers.length) ;
      }

      //break;
    }
  }

  open(target) {
    let p = this.numbers.indexOf(target);
    this.mask[p] = false;
  }

  randomChoose() {
    while (true) {
      var r = int(random(1, 26));
      var p = this.numbers.indexOf(r);
      if (this.mask[p] == true) {
        this.mask[p] = false;
        return r;
      }
    }
  }

  drawLines() {
    let line_count = 0;

    push();

    stroke(255, 0, 0);
    strokeWeight(3);

    if (this.ltrcnt == 5) {
      line_count++;
      stroke(255, 0, 0);
      strokeWeight(3);
      line(
        this.pos_x,
        this.pos_y,
        this.pos_x + this.cell_size * 4,
        this.pos_y + this.cell_size * 4
      );
    }

    if (this.rtlcnt == 5) {
      line_count++;
      line(
        this.pos_x + this.cell_size * 4,
        this.pos_y,
        this.pos_x,
        this.pos_y + this.cell_size * 4
      );
    }

    //hor and ver lines

    for (var i = 0; i < 5; i++) {
      if (this.jcnt[i] == 5) {
        line_count++;
        line(
          this.pos_x,
          this.pos_y + this.cell_size * i,
          this.pos_x + this.cell_size * 4,
          this.pos_y + this.cell_size * i
        );
      }

      if (this.icnt[i] == 5) {
        line_count++;
        line(
          this.pos_x + this.cell_size * i,
          this.pos_y,
          this.pos_x + this.cell_size * i,
          this.pos_y + this.cell_size * 4
        );
      }
    }

    //line_count

    textSize(17);
    strokeWeight(10);
    stroke(220);
    text(
      "linecount : " + line_count,
      this.pos_x + this.cell_size * 5,
      this.pos_y + this.cell_size * 3
    );

    pop();

    if (menu.status=='hide'&&line_count >= 5) {
      if (this.is_player) {
        menu.game_over("Player");
      } else {
        menu.game_over("Computer");
      }
    }
  }

  show() {
    var rx = this.pos_x;
    var ry = this.pos_y;

    var ni = 0;
    for (let j = 0; j < this.hor_line; j++) {
      for (let i = 0; i < this.ver_line; i++) {
        // draw square
        fill(255);
        rect(rx, ry, this.cell_size, this.cell_size);

        //ihaihshusdu
        if (dist(rx, ry, mouseX, mouseY) < 15) {
          //draw circle circle(choose ball)
          this.select_num = this.numbers[ni];
        }
        if (this.select_num == this.numbers[ni] && this.is_player) {
          fill(200, 200, 0, 100);
          circle(rx, ry, 25);
        }

        //draw circle circle(chosen)
        if (game_selected.indexOf(this.numbers[ni]) > -1 && this.is_player) {
          fill(0, 400, 0);
          circle(rx, ry, 25);
        }
        if (this.mask[ni] == false || this.is_player == true) {
          fill(0);
          textSize(16);
          text(this.numbers[ni], rx - 7, ry + 4);
        }

        ni = ni + 1;

        rx = rx + this.cell_size;
      }
      ry = ry + this.cell_size;
      rx = this.pos_x;
    }

    // text
    fill(17, 60, 120);
    if (this.is_player) {
      textSize(45);
      text("your turn", this.pos_x - 20, this.pos_y + 167);
      if (game_round % 2 == 0) {
        fill(0, 200, 0);
      } else {
        fill(200, 0, 0);
      }
      circle(this.pos_x - 20 + 200, this.pos_y + 167 - 10, 30);
    } else {
      textSize(37);
      text("computer turn", this.pos_x - 45, this.pos_y - 20);
      if (game_round % 2 == 1) {
        fill(0, 200, 0);
      } else {
        fill(200, 0, 0);
      }
      circle(this.pos_x - 20 + 237, this.pos_y + 167 - 195, 30);
    }
    //draw lines
    this.drawLines();
  }

  // circle(this.pos_x, this.pos_y + 167, 30);
  // circle(this.pos_x - 45, this.pos_y - 20, 30);

  // draw line (lets goooooooooooooooo)
}

class Menu {
  constructor() {
    this.restart();
  }

  show() {
    if (this.status == "hide") {
      return;
    }

    if (this.status == "start") {
      this.start_menu();
    } else {
      this.end_menu();
    }
  }

  start_menu() {
    
    
    
    push();
    fill(0, 0, 10, 199);
    rect(150, 200, 300, 400);
    //bingo text

    fill(255);
    textSize(50);
    text("Bingo", 60, 150);
    textSize(10);
    text(int(this.count), 180, 120);

    textSize(10);
    fill(200);
    text('touch "Bingo" and count down to start ', 62, 280);

    if (dist(mouseX, mouseY, 150, 150) < 49) {
      this.count = this.count - 4.1;
      if (this.count < 0) {
        this.status = "hide";
      }
    }

    //super cool animation
    this.mouse_cursor();

    pop();
  }

  mouse_cursor() {
    if (frameCount % 60 < 30) {
      this.cursor_size++;
    } else {
      this.cursor_size--;
    }
    noStroke();
    fill(frameCount % 255, 100, 100, 210);

    circle(mouseX, mouseY, this.cursor_size);
  }

  end_menu() {
    //background

    push();
    fill(0, 0, 10, 99);
    rect(150, 200, 300, 400);
    //winner
    
    // textSize(20);
    // fill(255);
    // text("WINNER: ", 40, 100);
    // fill(255, 255, 0);
    // textSize(30 + ((frameCount / 3.3456543) % 30));
    // text(this.winner, 40, 180);

    
    if(this.winner=='Computer'){
      
      image(winner,board.pos_x+170,board.pos_y);
    }else{
      
      image(winner,board.pos_x+170,board.pos_y+180);
      
    }
    
    
    
    
    //restart f9uheugefwgewu9gwpgwgiugp
    var restart_line = 380;
    strokeWeight(5);
    stroke(190, 255, 0, 0);
    fill(0);
    rect(150, restart_line, 350, 40);
    fill(255);
    textSize(20);
    text("Restart >>>", 190, restart_line+6);

    fill(0, 0, 180, 200);
    rect(this.restart_block_x, restart_line, 50, 40);

    var step = (50 - abs(restart_line - mouseY)) / 10;
    if (step > 0) {
      this.restart_block_x = this.restart_block_x + step;

      if (this.restart_block_x > 300) {
        this.restart();

        board.init();
        board2.init();
        game_round = 0;
        game_selected = [];
        computer_time = 0;
        
      }
    }

    this.mouse_cursor();

    pop();
  }

  game_over(winner) {
    this.winner = winner;
    this.status = "end";
    music1.pause();
    johncena.play();
  }

  restart() {
    this.status = "start";
    this.cursor_size = 15;
    this.count = 345;
    this.restart_block_x = 30;
    music1.loop();
  }
}

var board;
var board2;
var menu;

var game_round = 0;
var game_selected = [];
var computer_time = 0;
var winner;
var music1;
var johncena ;




function preload() {
  winner = loadImage('https://cdn2.iconfinder.com/data/icons/thesquid-ink-40-free-flat-icon-pack/64/cup-64.png');
 music1 = loadSound('music.mp3');
  johncena=loadSound('johncenaprankcall_cutted (1).mp3');
}



function setup() {
  rectMode(CENTER);
  createCanvas(300, 400);

  board = new Board(50, 50, false);
  board2 = new Board(50, 220, true);
  menu = new Menu();
  
  

}

function draw() {
  background(220);
  board.show();
  board2.show();

  //com choose

  if ( menu.status == 'hide' && game_round % 2 == 1 && frameCount - computer_time > random(4, 7) * 5) {
    var r = board.randomChoose();
    game_selected.push(r);
    game_round++;

    board.count_select(r);
    board2.count_select(r);

    board.debug();
    board2.debug();
  }

  menu.show();
}

function mouseClicked() {
  if (menu.status == "start" ||   menu.status == 'end'  ) {
    return;
  }

  if (game_round % 2 == 0) {
    if (game_selected.indexOf(board2.select_num) == -1) {
      //player choose

      board.open(board2.select_num);
      game_selected.push(board2.select_num);
      game_round++;
      board.count_select(board2.select_num);
      board2.count_select(board2.select_num);

      //set time

      computer_time = frameCount;
    }
  }
}
