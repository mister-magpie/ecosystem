var hashMap = new Map()

function cubeSprite(x,y,color){
    let rec = new PIXI.Graphics()
    rec.beginFill(color);
    rec.lineStyle(1,"0x000000",1);
    rec.drawRect(x,y,pixelSize,pixelSize);
    rec.endFill();
    //rec.boundsPadding = 0;
    let texture = rec.generateTexture();
    var sprite = new PIXI.Sprite(texture);
    sprite.setTransform(x*pixelSize,y*pixelSize);
    app.stage.addChild(sprite);
    return sprite
}


/*
birds are white and fly around the map
*/
var bird = function(position){
    this.type = "bird";
    this.x = Math.floor(position/100) //| Math.round(Math.random()*99);
    this.y = position%100 //| Math.round(Math.random()*99);
    this.color = "0xffffff";
    this.sprite = cubeSprite(this.x,this.y,this.color);
    this.energy = 100;

    app.stage.addChild(this.sprite);

    // movement
    this.move = function(dx,dy){
        var newx = this.x + (dx | Math.round(Math.random()*2 - 1));
        var newy = this.y + (dy | Math.round(Math.random()*2 - 1));
        if (newx < 0) newx += 100;
        if (this.y < 0) this.y += 100;
        if (newx > 99) newx -= 100;
        if (newy > 99) newy -= 100;
        //check for hash collision here?
        console.log("new position " + newx+newy);
        this.x = newx
        this.y = newy
    }
    this.step = function(){
        console.log("steppin");
        //hashMap.delete(hashLocation(this.x,this.y));
        this.move();
        this.sprite.x = this.x*pixelSize;
        this.sprite.y = this.y*pixelSize;
        //hashMap.set(hashLocation(this.x,this.y), this);

    }

    this._stepz = function(){
        //this.energy -= 1;
        if (false) {
            //if energy is 0 bird dies
            console.log("starve");
            //this.dispose()
        }
        // remove me from my current hashMap position
        hashMap.delete(hashLocation(this.x,this.y));

        // Random movement
        this.move();
        // update sprite position
        this.sprite.x = this.x*pixelSize;
        this.sprite.y = this.y*pixelSize;

        // update hashMap
        // let collision = hashMap.get(hashLocation(this.x,this.y));
        // console.log(collision);
        // if (collision !== undefined & collision !== this) {
        //     //console.log(collision.length)
        //     for(i=0;i<collision.length;i++){
        //         switch (collision[i].type) {
        //
        //             case "bird":
        //             console.log("bird collision: " + this.x + " - " + this.y);
        //             collision[i].sprite.tint = "0xff0000"
        //             this.sprite.tint = "0xff0000"
        //             break;
        //
        //             case "fish":
        //             //fish dies
        //             console.log("bird eats fish")
        //             //collision.dispose()
        //             this.energy += 1
        //
        //             default:
        //             //default
        //         }
        //     }
        // }
        hashMap.set(hashLocation(this.x,this.y),this)
    }
    // death
    this.dispose = function(){
        console.log("bird dies of starvation");
        app.stage.removeChild(this.sprite);
        setTimeout(function(){
            //console.log("disposing");
            hashMap.delete(hashLocation(this.x,this.y))
        },500);
    }
}


/*
Fishes are dark blue and wonder in the sea
*/
var fish = function(position){
    this.type = "fish";
    //let rand = getRandomSeaTile(); // |notation is bugged
    let pos = position;
    this.x = Math.floor(pos/100);
    this.y = pos%100;
    this.color = "0x000044";
    this.sprite = cubeSprite(this.x,this.y,this.color);
    this.energy = 100;

    app.stage.addChild(this.sprite);


    // movement
    this.move = function(dx,dy){
        while (true) {
            this.x += dx | Math.round(Math.random()*2 - 1);
            this.y += dy | Math.round(Math.random()*2 - 1);
            if (this.x < 0) this.x += 100;
            if (this.y < 0) this.y += 100;
            if (this.x > 99) this.x -= 100;
            if (this.y > 99) this.y -= 100;
            let k = this.x*100 + this.y
            if(seaTiles.includes(k)) break;
        }
    }
    this.adjacent = function(){
        var k = this.x*100 + this.y
        var a = [k+1,k-1,k+100,k-100,k+99,k-99,k+101,k-101]
        for (var i = 0; i < a.length; i++) {
            if (seaTiles.includes(a[i]) & hashMap.get(a[i]) === undefined){
                //console.log("not sea");
                return a[i]
            }
        }
    }
    this.step = function(){
        //water quality can kill fish
        let wq = 1;
        if (wq < 1) {
            "fish dead by pollution"
            if(Math.random() > wq) this.dispose();
        }
        // reproduce
        if(Math.random() <= 0.1){
            let t = this.adjacent();
            if (t!==undefined) {
                console.log("fish is born on " + t)
                hashMap.set(t,new fish(t))
            }
        }
    }
    // death
    this.dispose = function(){
        app.stage.removeChild(this.sprite);
        setTimeout(function(){
            //console.log("disposing");
            //creatures.pop(creatures.indexOf(this))
            hashMap.delete(hashLocation(this.x,this.y))
        },100);
    }
}
/*FISHES*/

//var creatures = new Set();
function createBirds(m){
    n = m | 50
    for(i=0;i<n;i++){
        //creatures.add(new bird());
        hashMap.set(getRandomSeaTile(), new fish(getRandomSeaTile()));
    }
    hashMap.set(getRandomGrassTile(), new bird(getRandomGrassTile()));

}

function getRandomSeaTile(){
    let i = Math.floor(Math.random()*4370);
    return seaTiles[i];
}
function getRandomGrassTile(){
    let i = Math.floor(Math.random()*2554);
    return grassTiles[i];
}

function hashLocation(posX,posY){
    return posX*100 + posY
}

function addToHashMap(key,obj){

}
function updateHashMap(key, obj){
    //console.log("adding to hash");
    collision = null;
    if(hashMap.get(key) ){
        hashMap.set(key, obj);
    }
    else{
        collision = hashMap.get(key)
    }
    return collision;
}
