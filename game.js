var gold = 300;
        var chances = 60;
        var leftchances = 60;
            var td = document.getElementById('td');
            var ctx = td.getContext('2d');
            td.width = window.innerWidth-5;
            td.height = window.innerHeight-5;

            var road = [[td.width/2,0],[td.width/2,td.height]];

            var heroesarr = [];

            function drawRoad(){
            ctx.beginPath();
            ctx.fillStyle = "#debc8d";
            ctx.rect(td.width/2-50,0,100,td.height);
            ctx.fill();
            ctx.closePath();
            }

            // creating object constructor for enemies
            function Enemy(params){
                this.name = params.name;
                this.health = params.health;
                this.currHealth = this.health;
                this.armor = params.armor;
                this.radius = 25;
                this.color = params.color;
                this.speed = params.speed;
                this.roadToFollow = params.road;
                this.gold = params.gold;
                this.x = road[0][0];
                this.y = road[0][1];
                this.step = 0;
                this.gagma = false;
                this.draw = function(){
                    //health bar
                    var currHealthPersentage = this.health/this.currHealth*100;
                    var barWidth = this.radius*2;
                    var leftHealth = barWidth/currHealthPersentage*100;
                    ctx.fillStyle='green';
                    ctx.beginPath();
                    ctx.strokeRect(this.x - this.radius, this.y-this.radius-10,barWidth,10);
                    ctx.fillRect(this.x - this.radius + 1, this.y-this.radius-9, leftHealth - 2, 8);
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
                    ctx.fill();
                    ctx.closePath();
                }
                this.move = function(){
                    if((this.step < road.length - 1) && road[this.step][0] == road[this.step+1][0]){
                        // y coordinati icvleba
                        if(road[this.step][1] < road[this.step + 1][1]){
                            // y++
                            if(this.y < road[this.step + 1][1])
                                this.y+=this.speed;
                            else
                                this.step++;
                            if(this.step == road.length - 1 && this.y >= road[this.step][1] ){
                                this.gagma = true;
                                leftchances--;
                                document.getElementById('chance').innerHTML = leftchances;
                            }
                        }else{
                            // y--
                            if(this.y > road[this.step + 1][1])
                                this.y-=this.speed;
                            else
                                this.step++;

                            if(this.step == road.length - 1 && this.y <= road[this.step][1] ){
                                this.gagma = true;
                                leftchances--;
                                document.getElementById('chance').innerHTML = leftchances;
                            }
                        }

                    } else if((this.step < road.length - 1) && road[this.step][1] == road[this.step+1][1]){
                        // x coordinati icvleba
                        if(road[this.step][0] < road[this.step + 1][0]){
                            // x++
                            if(this.x < road[this.step + 1][0])
                                this.x+=this.speed;
                            else
                                this.step++;
                            if(this.step == road.length - 1 && this.x >= road[this.step][0] ){
                                this.gagma = true;
                                leftchances--;
                                document.getElementById('chance').innerHTML = leftchances;
                            }
                        }else{
                            // x--
                            if(this.x > road[this.step + 1][0])
                                this.x-=this.speed;
                            else
                                this.step++;

                            if(this.step == road.length - 1 && this.x <= road[this.step][0] ){
                                this.gagma = true;
                                leftchances--;
                                document.getElementById('chance').innerHTML = leftchances;
                            }
                        }
                    }

                }
            }

            //creating the hero object
            function Hero(params){
                this.name = params.name;
                this.damage = params.damage;
                this.color = params.color;
                this.attakSpeed = params.attakSpeed;
                this.radius = 25;
                this.level = 1;
                this.maxLevel = params.maxLevel;
                this.attakrange = params.attakrange;
                this.magicDamage = params.magicDamage;
                this.x = params.x;
                this.y = params.y;
                this.cost = params.cost;
                this.items = [];
                this.angle = 0;
                this.bulletSpeed = 0;
                this.bullets = [];
                this.targetEnemy;

                this.isEnemyInRange = function(wave){
                    var isEnemyInRange = false;
                    var topLeft = false;
                    var topRight = false;
                    var bottomLeft = false;
                    var bottomRight = false;
                    for(i in wave){
                      if(!wave[i].gagma){
                        //top left side done
                        for(j=0; j<=360; j++){
                            if(wave[i].x >= this.x + Math.sin(j) * this.attakrange && wave[i].y >= this.y + Math.cos(j) * this.attakrange){
                                topLeft = true;
                                break;
                            }
                        }
                        // top right side done
                        for(j=0; j<=360; j++){
                            if(wave[i].x <= this.x + Math.sin(j) * this.attakrange && wave[i].y >= this.y + Math.cos(j) * this.attakrange){
                                topRight = true;
                                break;
                            }
                        }
                        // bottom left side done
                        for(j=0; j<=360; j++){
                            if(wave[i].x >= this.x + Math.sin(j) * this.attakrange && wave[i].y <= this.y + Math.cos(j) * this.attakrange){
                                bottomLeft = true;
                                break;
                            }
                        }
                        // bottom right side done
                        for(j=0; j<=360; j++){
                            if(wave[i].x <= this.x + Math.sin(j) * this.attakrange && wave[i].y <= this.y + Math.cos(j) * this.attakrange){
                                bottomRight = true;
                                break;
                            }
                        }

                        if(topLeft && topRight && bottomLeft && bottomRight){
                            isEnemyInRange = i;
                            break;
                        }
                      }
                    }
                    return isEnemyInRange;
                }
                this.draw = function(){
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate( this.x, this.y );
                    ctx.rotate(this.angle * Math.PI/180);
                    ctx.fillStyle = "blue";
                    ctx.fillRect(-25,-25,50,50);
                    ctx.translate( -this.x, -this.y );
                    ctx.closePath();
                    ctx.restore();
                }
                this.drawBullets = function(){
                  for(i in this.bullets){
                    if(!this.bullets[i].isOnTarget){

                      ctx.beginPath();
                      ctx.fillStyle = 'yellow';
                      ctx.fillRect(this.bullets[i].x,this.bullets[i].y,10,10);
                      ctx.closePath();

                      var xOnTarget = false;
                      var yOnTarget = false;
                      var diffX = Math.abs(this.bullets[i].x - this.bullets[i].targetX);
                      var diffY = Math.abs(this.bullets[i].y - this.bullets[i].targetY);
                      if(this.bullets[i].x > this.bullets[i].targetX){
                        // bullet x--

                        if(diffX > diffY){
                          this.bullets[i].x-=(2 + diffX / diffY);
                        }
                        else{
                          this.bullets[i].x-=2;
                        }

                        if(this.bullets[i].x <= this.bullets[i].targetX){
                          xOnTarget = true;
                        }
                      }else if(this.bullets[i].x < this.bullets[i].targetX){
                        // bullet x++
                        if(diffX > diffY){
                          this.bullets[i].x+=(2 + diffX / diffY);
                        }
                        else{
                          this.bullets[i].x+=2;
                        }

                        if(this.bullets[i].x >= this.bullets[i].targetX){
                          xOnTarget = true;
                        }
                      }

                      if(this.bullets[i].y > this.bullets[i].targetY){
                        // bullet y--
                        if(diffY > diffX){
                          this.bullets[i].y-=(2 + diffY / diffX);
                        }
                        else{
                          this.bullets[i].y-=2;
                        }

                        if(this.bullets[i].y <= this.bullets[i].targetY){
                          yOnTarget = true;
                        }
                      }else if(this.bullets[i].y < this.bullets[i].targetY){
                        // bullet y++
                        if(diffY > diffX){
                          this.bullets[i].y+=(2 + diffY / diffX);
                        }
                        else{
                          this.bullets[i].y+=2;
                        }

                        if(this.bullets[i].y >= this.bullets[i].targetY){
                          yOnTarget = true;
                        }
                      }

                      if(xOnTarget && yOnTarget){
                        this.bullets[i].isOnTarget = true;

                        if(this.targetEnemy.currHealth - this.damage < 0){
                          this.targetEnemy.currHealth=0;
                          this.targetEnemy.gagma = true;
                          gold += this.targetEnemy.gold;
                          document.getElementById('gold').innerHTML = gold;
                        }else{
                          this.targetEnemy.currHealth-=this.damage;
                        }
                      }
                    }
                  }
                }
                this.shoot = function(){
                  if(this.bulletSpeed == 0){
                    // create bullet
                    var bullet = new Object();
                    bullet.x = this.x - 25;
                    bullet.y = this.y - 25;
                    bullet.targetX = this.targetEnemy.x;
                    bullet.targetY = this.targetEnemy.y;
                    bullet.isOnTarget = false;
                    this.bullets.push(bullet);
                  }

                  if(this.bulletSpeed < 50){
                    this.bulletSpeed++;
                  }else if(this.bulletSpeed == 50){
                    this.bulletSpeed = 0;
                  }

                  this.drawBullets();
                }

            }


            function Game(){
            this.gameOver = false;
            this.wave = [];
            this.allWave = 50;
            this.numOfEnemyPerWave = 10;
            this.fps = 0;
            this.fullWaveLoaded = false;
            this.waveCount = 1;
            this.wait = 0;
            this.waveStart = false;
            this.waveCounter = 1;
            this.over = function(){
                alert("it's over :(");
            }
            this.win = function(){

            }
            // this.marilze = function(){
            //     var c = 0;
            //     for(i in this.wave){
            //         if(this.wave[i].gagma){
            //             c++;
            //         }
            //     }
            //     this.leftchances = this.chances - c;
            // }
            this.createWave = function(){
                    this.wave.splice(0,this.wave.length);
                    for(i=0; i<30+(this.waveCount-1)*5; i++){
                    this.wave.push(new Enemy({
                        name: "enemy",
                        health: 128,
                        armor: 10,
                        gold: 50,
                        color: 'rgb(255,0,0)',
                        speed: 0.5 + this.waveCounter/10 + this.waveCounter/10,
                    }));
                    }
            }
            this.init = function(){
                document.getElementById('gold').innerHTML = gold;
                document.getElementById('currentWave').innerHTML = this.waveCounter;
                document.getElementById("allwave").innerHTML = this.allWave;
                document.getElementById("chance").innerHTML = leftchances;
                document.getElementById("allChances").innerHTML = chances;
            }
            this.update = function(){
                var that = this;
                var waveCounter = 0;
                var frameCounter = 1;
                that.createWave();

                this.fps = setInterval(function(){
                    clear();
                    drawEnv();
                    drawRoad();
                    if(heroesarr.length > 0){
                        for(h in heroesarr){
                            heroesarr[h].draw();
                            if(isEnemyInRange = heroesarr[h].isEnemyInRange(that.wave)){
                                var angle = Math.atan2(heroesarr[h].y - that.wave[isEnemyInRange].y, heroesarr[h].x - that.wave[isEnemyInRange].x) * 180 / Math.PI;
                                heroesarr[h].angle = angle;
                                heroesarr[h].targetEnemy = that.wave[isEnemyInRange];
                                heroesarr[h].shoot();
                            }
                        }
                    }
                    var deadEnemyinCurrWave = 0;
                    if(that.waveStart == false){
                        document.getElementsByClassName('wave')[0].style.display = "block";
                        clearInterval(that.fps);
                        var waitCount = 0;
                        var remminute = 2;
                        var remsec = 0;
                        that.wait = setInterval(function(){
                            if(heroesarr.length > 0){
                                for(h in heroesarr){
                                    heroesarr[h].draw();
                                }
                            }
                            if(waitCount >= 10){
                                document.getElementsByClassName('wave')[0].style.display = "none";
                                clearInterval(that.wait);
                                that.waveStart = true;
                                that.update();
                            }

                            document.getElementById('wavetime').innerHTML = remminute + ":" + remsec + "s";
                            remsec--;
                            if(remsec < 0){
                                remsec = 59;
                                remminute--;
                            }


                            waitCount++;
                        },1000);
                    }


                    frameCounter++;
                    if(frameCounter / 100 > 10/that.wave[0].speed/10 ){
                        // if(that.waveCounter < that.wave.length){
                        //     that.waveCounter++;
                        // }else{
                        //     frameCounter = 0;
                        // }
                        frameCounter = 0;
                        if(that.waveCounter < that.wave.length){
                            that.waveCounter++;
                        }
                    }

                    for(i=0; i<that.waveCounter; i++){
                        if(!that.wave[i].gagma){
                            that.wave[i].draw();
                            that.wave[i].move();
                        }
                        else{
                            deadEnemyinCurrWave++;
                            if(leftchances - deadEnemyinCurrWave < 0){
                                clearInterval(that.fps);
                                that.over();
                            }

                        }
                    }

                    //if current wave ends
                    if(deadEnemyinCurrWave == that.wave.length){
                        that.waveCount++;
                        // leftchances-=deadEnemyinCurrWave;
                        // document.getElementById('chance').innerHTML = leftchances;
                        document.getElementById('currentWave').innerHTML = that.waveCount;
                        if(that.waveCount < 30){
                            that.waveCounter = 0;
                            frameCounter = 1;
                            deadEnemyinCurrWave = 0;
                            that.createWave();
                            that.waveStart = false;
                        }

                    }

                },10);
            }

            this.play = function(){
                this.init();
                this.update();
            }
            }


            function allowToPutHero(event){
                var allow = true;

                for(i = 0;  i < road.length-1; i++){
                    var notallow = true;
                    if(road[i][0] !== road[i+1][0]){
                        for(j=road[i][0]; j<=road[i+1][0]; j++){

                            if((event.clientX-25 <= j+50) && (event.clientX+25 >= j-50) && (event.clientY-25 <= road[i][1]+50) && (event.clientY+25) >= road[i][1]-50){
                                allow = false;
                                notallow = false;
                                break;
                            }
                        }
                    }
                    else if(road[i][1] !== road[i+1][1]){
                        for(j=road[i][1]; j<=road[i+1][1]; j++){
                             if((event.clientY-25 <= j+50) && (event.clientY+25 >= j-50) && (event.clientX-25 <= road[i][0]+50) && (event.clientX+25) >= road[i][0]-50){
                                allow = false;
                                notallow = false;
                                break;
                             }
                        }
                    }
                    if(!notallow){
                        allow = notallow;

                        break;
                    }
                }

                for(i in heroesarr){
                    if((event.clientX-25 <= heroesarr[i].x+25) && (event.clientX+25 >= heroesarr[i].x-25) && (event.clientY-25 <= heroesarr[i].y+25) && (event.clientY+25) >= heroesarr[i].y-25){
                        allow = false;
                    }
                }

                return allow;
            }

            // draw the background evnironment
            function drawEnv(){
            ctx.beginPath();
            ctx.fillStyle = "#018E0E";
            ctx.rect(0,0,td.width,td.height);
            ctx.fill();
            ctx.closePath();
            }

            function clear(){
            ctx.clearRect(0,0,td.width,td.height);
            }

            drawEnv();
            drawRoad();

            var game = new Game();
            game.play();



            //select new hero
            document.getElementById('buyheroes').onclick = function(){
                if(document.getElementById('heroes').getAttribute('class') == null){
                    document.getElementById('heroes').style.display = 'block';
                    document.getElementById('heroes').style.left = ((screen.availWidth / 2) - (document.getElementById('heroes').clientWidth / 2)) + "px";
                    document.getElementById('heroes').style.top = ((screen.availHeight / 2) - (document.getElementById('heroes').clientHeight / 2)) + "px";
                    document.getElementById('heroes').setAttribute('class','open');
                    document.getElementById('buyheroes').getElementsByTagName('span')[0].style.transform = "rotate(45deg)";
                }
                else{
                    document.getElementById('heroes').removeAttribute('class');
                    document.getElementById('heroes').style.display = 'none';
                    document.getElementById('buyheroes').getElementsByTagName('span')[0].style.transform = "rotate(0deg)";
                }
            }

            var selectBtns = document.getElementsByClassName('select');
            var classN;
            for(i in selectBtns){
                selectBtns[i].onclick = function(e){
                    document.getElementById('heroes').style.display = 'none';
                    classN = this.parentNode.getElementsByTagName('div')[0].className;
                    document.getElementById('heroes').removeAttribute('class');
                    document.getElementById('buyheroes').getElementsByTagName('span')[0].style.transform = "rotate(0deg)";
                    var hero = document.createElement('div');
                    hero.style.left = (e.clientX - 25) + 'px';
                    hero.style.top = (e.clientY - 25) + 'px';
                    hero.className = classN;
                    hero.setAttribute('id','herotoput');

                    document.body.appendChild(hero);


                    document.addEventListener('mousemove', allowtoputXero);
                    document.addEventListener('click',putXero);

                    document.onkeydown = function(e){
                        if(e.keyCode == 27){
                            document.body.removeChild(hero);
                            document.removeEventListener('mousemove',allowtoputXero);
                            document.removeEventListener('click',putXero);
                        }
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }

            function putXero(e){
                var hero = document.getElementById('herotoput');
                if(allow = allowToPutHero(e)){
                    //allow to put hero
                    if(gold - 150 >= 0){
                        var xero = new Hero({
                                name: 'vaja',
                                damage: 15,
                                color: 'blue',
                                attakSpeed: 2,
                                maxLevel: 20,
                                attakrange: 200,
                                magicDamage: 20,
                                x: e.clientX,
                                y: e.clientY,
                                cost: 150
                            });
                        heroesarr.push(xero);
                        document.body.removeChild(hero);
                        gold-=150;
                        document.getElementById('gold').innerHTML = gold;
                        document.removeEventListener('mousemove',allowtoputXero);
                        document.removeEventListener('click',putXero);
                    }
                    else{
                        alert('more gold is required!');
                    }
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
            }

            function allowtoputXero(event){
                var hero = document.getElementById('herotoput');
                hero.style.left = (event.clientX - 25) + 'px';
                hero.style.top = (event.clientY - 25) + 'px';
                if(allow = allowToPutHero(event)){
                    hero.className = classN;
                }
                else{
                    hero.className = classN + ' notallow';
                }
                event.stopPropagation();
                event.stopImmediatePropagation();
            }