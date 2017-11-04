var animals = []; // array of objects(animals) with thier methods,data
var animalsNames = ["dragon"]; //name for loading images
var actionsNames = ["forward", "left"]; //list of all our animations which we use for drawing images
var scl = 0.5; //scale just for images

function preload() {

    //creats all objects
    for (let i = 0; i < animalsNames.length; i++) {
        animals.push(animal(animalsNames[i]));
    }

    //animal// three actions//frames
    //loads all images
    for (let i = 0; i < animalsNames.length; i++) {
        for (let j = 0; j < actionsNames.length; j++) {
            for (let k = 1; k <= 29; k++) {
                let zero = k > 9 ? "00" : "000";
                loadImage("assets/" + animalsNames[i] + "/" + actionsNames[j] + "/" + zero + k + ".png", function(img) {
                    img.resize(img.width * scl, img.height * scl);
                    //create points from images
                    animals[i].createFrame(img, actionsNames[j]);

                });
            }
        }
    }
}

function setup() {
    
    frameRate(10);
    createCanvas(windowWidth, windowHeight);

    animals[0].x = width / 2;
    animals[0].y = height / 2;


}

function draw() {
    background(0);

    animals[0].draw(actionsNames[0], 5);
  


}

function createPointsForlines(arr) {
    var points = [];
    for (var i = 0; i < arr.length; i += 50) {
        points.push([arr[i]]); //current point arr[i]
        var insex = points.length - 1;
        for (var j = 0; j < arr.length; j += 200) {
            //point to compare arr[j];
            var a = points[insex][0].x - arr[j].x;
            var b = points[insex][0].y - arr[j].y;
            var dToCurrentP = a * a + b * b;
            if (dToCurrentP > 0) {
                if (points[insex].length > 2) {
                    for (var k = 0; k < 2; k++) {


                        a = points[insex][0].x - points[insex][1].x;
                        b = points[insex][0].y - points[insex][1].y;
                        var dist1 = a * a + b * b;
                        a = points[insex][0].x - points[insex][2].x;
                        b = points[insex][0].y - points[insex][2].y;
                        var dist2 = a * a + b * b;

                        if (dToCurrentP < dist1 && dToCurrentP < dist2) {
                            if (dist1 < dist2) {
                                points[insex][2] = arr[j];
                            } else {
                                points[insex][1] = arr[j];
                            }
                        } else if (dToCurrentP < dist1) {
                            points[insex][1] = arr[j];
                        } else if (dToCurrentP < dist2) {
                            points[insex][2] = arr[j];
                        }

                    }
                } else {
                    points[insex].push(arr[j]);
                }
            }

        }
    }
    return points;
}




function animal(name) {

    return {
        "x": width / 2,
        "y": height / 2,
        "frames": {
            "forward": [],
            "left": [],
            "right": [],
            "forwardLines": [],
            "leftLines": []


        },
        "name": name,
        "width": 0,
        "height": 0,
        "speed": 10,
        "speed2": -10,
        "direction": createVector(0, -1),

        "acceleration": 1,
        "rotation": 0,

        "createFrame": function(img, actionName) {

            this.width = img.width;
            this.height = img.height;

            this.frames[actionName].push([]);

            img.loadPixels();


            for (var x = 0; x < img.width; x++) {
                for (var y = 0; y < img.height; y++) {
                    var index = (img.width * y + x) * 4;

                    var r = img.pixels[index];
                    var g = img.pixels[index + 1];
                    var b = img.pixels[index + 2];
                    var a = img.pixels[index + 3];

                    var over = (r + g + b) / 3;

                    if (a > 1) {

                        var c = parseInt(Math.random() * this.frames[actionName][this.frames[actionName].length - 1].length);
                        this.frames[actionName][this.frames[actionName].length - 1].splice(c, 0, {
                            "x": x,
                            "y": y
                        });
                    }
                }
            }
            this.frames[actionName + "Lines"].push(createPointsForlines(this.frames[actionName][this.frames[actionName].length - 1]));


        }

        ,
        "draw": function(actionName, radius) {


            var monster = this.frames[actionName];
            var currFrame = frameCount % monster.length;
            var offX = this.x - this.width / 2;
            var offY = this.y - this.height / 2;

            push();
            translate(this.x, this.y);
            rotate(this.rotation);

            translate(-this.x, -this.y);

            for (var i = 0; i < monster[currFrame].length; i = i + 50) {

                fill(255);
                ellipse(monster[currFrame][i].x + offX, monster[currFrame][i].y + offY, radius, radius);

            }
            var lineMonster = this.frames[actionName + "Lines"];

            for (let i = 0; i < lineMonster[currFrame].length; i++) {
                // stroke(Math.random()*100,Math.random()*100,Math.random()*100);
                stroke(255);
                line(lineMonster[currFrame][i][0].x + offX, lineMonster[currFrame][i][0].y + offY, lineMonster[currFrame][i][1].x + offX, lineMonster[currFrame][i][1].y + offY);
                line(lineMonster[currFrame][i][0].x + offX, lineMonster[currFrame][i][0].y + offY, lineMonster[currFrame][i][2].x + offX, lineMonster[currFrame][i][2].y + offY);
            }
            pop();

        },
        "move": function() {

            this.y += this.direction.y * this.speed * this.acceleration;
            this.x += this.direction.x * this.speed * this.acceleration;

        },
        "turn": function() {

            this.rotation


        }


    }

}