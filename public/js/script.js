let canvas2 = document.getElementById('canvas2');
let context = canvas2.getContext('2d');

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas2.width = window_width;
canvas2.height = window_height;

class Circle {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed

        this.dx = 1 * speed;
        this.dy = 1 * speed
    }
    
    draw(context){
        context.beginPath();
        context.lineWidth = 5;
        context.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }
    
    update(){

        this.draw(context);

        if ((this.x + this.radius) > window_width){
            this.dx = -this.dx;
        }
        if ((this.x - this.radius) < 0){
            this.dx = -this.dx;
        }
        if ((this.y + this.radius) > window_height){
            this.dy = -this.dy;
        }
        if ((this.y - this.radius) < 0){
            this.dy = -this.dy;
        }
        
        this.x += this.dx;
        this.y += this.dy;
    }
}

var all_circles = [];

let randomNumber = function(min, max) {
    var result = Math.random() * (max - min) + min;
    console.log(result);
    return result;
}


for ( var i = 0; i < 10; i++) {
    var radius = 50;
    var random_x = randomNumber(radius, (window_width - radius));
    var random_y = randomNumber(radius, (window_height - radius));
    let my_circle = new Circle(random_x, random_y, radius, "white", 5);
    all_circles.push(my_circle);
}

let updateCircle = function() {
    requestAnimationFrame(updateCircle);
    context.clearRect(0, 0, window_width, window_height);

    all_circles.forEach(element => {
        element.update();
    })

}
updateCircle();


////////////////////

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('file-upload');
const audio1 = document.getElementById('audio1'); //access source attribute//
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//call 2d drawing methods through canvas//
const ctx = canvas.getContext('2d');
let audioSource;
let analyser; 

//convert music to frequency//
file.addEventListener('change', function(){
    const files = this.files;
    audio1.src = URL.createObjectURL(files[0]); //convert audio to source//
    audio1.load(); //update audio element//
    audio1.play();
    const audioContext = new AudioContext();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);
    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    function animate() {
        requestAnimationFrame(animate);
        x = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
    }
    animate();
    
});
function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] * 2;
        const red = i*barHeight/2;
        const green = i*3;
        const blue =i*2;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}