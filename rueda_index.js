const sectors = [
  { color: '#f82', label: 'Stack' },
  { color: '#0bf', label: '10' },
  { color: '#fb0', label: '200' },
  { color: '#0fb', label: '50' },
  { color: '#b0f', label: '100' },
  { color: '#f0b', label: '5' },
  { color: '#bf0', label: '500' }
]

const rand = (m, M) => Math.random() * (M - m) + m
const tot = sectors.length
const spinEl = document.querySelector('#spin')
const ctx = document.querySelector('#wheel').getContext('2d')
const dia = ctx.canvas.width
const rad = dia / 2
const PI = Math.PI
const TAU = 2 * PI
const arc = TAU / sectors.length

const friction = 0.991 // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0 // Angular velocity
let ang = 0 // Angle in radians

let prev_mem
var ciclo = 0
var show

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot

function drawSector(sector, i) {
  const ang = arc * i
  ctx.save()
  // COLOR
  ctx.beginPath()
  ctx.fillStyle = sector.color
  ctx.moveTo(rad, rad)
  ctx.arc(rad, rad, rad, ang, ang + arc)
  ctx.lineTo(rad, rad)
  ctx.fill()
  // TEXT
  ctx.translate(rad, rad)
  ctx.rotate(ang + arc / 2)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText(sector.label, rad - 10, 10)
  //
  ctx.restore()
}

function rotate() {
    const sector = sectors[getIndex()]
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`
    spinEl.textContent = !angVel ? 'SPIN' : sector.label
    spinEl.style.background = sector.color
        
    return sector.label
}

function frame() {
    if (!angVel) return
    angVel *= friction // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0 // Bring to stop
    ang += angVel // Update angle
    ang %= TAU // Normalize angle
    //rotate()
    return rotate()
}

function engine() {

    let mem = frame()
    
    if(mem === undefined){
	//nada
    }else{
	if(prev_mem == mem&&angVel==0){

	    const defaults = {
	      spread: 360,
	      ticks: 100,
	      gravity: 0,
	      decay: 0.94,
	      startVelocity: 30,
	  };
	  
	  function shoot() {
	      confetti({
		  ...defaults,
		  particleCount: 30,
		  scalar: 1.2,
		  shapes: ["circle", "square"],
		  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
	      });
	      
	      confetti({
		  ...defaults,
		  particleCount: 20,
		  scalar: 2,
		  shapes: ["emoji"],
		  shapeOptions: {
		      emoji: {
			  value: ["🦄", "🌈"],
		      },
		  },
	      });
	  }
	  
	  setTimeout(shoot, 0);
	  setTimeout(shoot, 100);
	  setTimeout(shoot, 200);
	    
	}
    }
    prev_mem = mem
    requestAnimationFrame(engine)
}

function init() {
    console.log("parado init")
    show = false
    sectors.forEach(drawSector)
    rotate() // Initial rotation
    engine() // Start engine

    spinEl.addEventListener('click', () => {
	if (!angVel) angVel = rand(0.25, 0.45)
    })    
}

init()
