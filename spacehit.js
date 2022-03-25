const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

cvs.width = innerWidth
cvs.height = innerHeight

const scoreEL = document.querySelector('#scoreEL')
const startgamebtn = document.querySelector('#startgamebtn')
const frameEL = document.querySelector('#frameEL')
const bigscoreEL= document.querySelector('#bigscoreEL')

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99
class Explosion {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const x = cvs.width / 2
const y = cvs.height / 2

let player = new Player(x, y, 15, 'beige')
let projectiles = []
let enemies = []
let explosions = []

//restart game values
function init() {
    player = new Player(x, y, 15, 'beige')
    projectiles = []
    enemies = []
    explosions = []
    score = 0
    scoreEL.innerHTML = 0
    bigscoreEL.innerHTML = 0
}

function spawnEnemies() {
    setInterval(()=> {
        const radius = Math.random() * (30 - 5) + 5
        
        let x 
        let y
    //To get enemy move from different directions coming from out of the canvas frame
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : cvs.width + radius
            y = Math.random() * cvs.height
        } else {
            x = Math.random() * cvs.width
            y = Math.random() < 0.5 ? 0 - radius : cvs.height + radius
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    //To get the enemies moving towards the Player
        const angle = Math.atan2(
            cvs.height / 2 - y ,
            cvs.width / 2 - x 
            )
        
        const velocity = {
                x: Math.cos(angle), //x adjacent axis
                y: Math.sin(angle)  //y adjacent axis
            }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

let animationID
let score = 0

//Repeatedly adding new frames to create the effect of the projectile flying away 
function animate() {
    animationID = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0, 0, 0,0.1)'
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    player.draw()

    explosions.forEach((explosion, index) => {
        if (explosion.alpha <= 0 ){
            explosions.splice(index, 1)
        } else {
        explosion.update()
        }
    })

    projectiles.forEach((projectile, index) => {
        projectile.update()

        //remove projectiles when reach out of the screen to stop repeated copytation
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > cvs.width
            || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > cvs.Height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
           }, 0)
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        //Game lost
        if(dist - enemy.radius - player.radius < 1) {
            mySound = new sound("gameover.wav")
            cancelAnimationFrame(animationID)
            frameEL.style.display = 'flex'
            bigscoreEL.innerHTML = score
        }

        projectiles.forEach((projectile, pjindex) => {
           const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
           //Enemy is shooted
           if (dist - enemy.radius - projectile.radius < 1) {


               //Explosion
                for (let i = 0; i < enemy.radius * 2; i++) {
                    explosions.push(new Explosion(projectile.x, projectile.y, Math.random() * 2, enemy.color, 
                    {
                        x: (Math.random() - 0.5) * (Math.random() * 5), 
                        y: (Math.random() - 0.5) * (Math.random() * 5)
                    })
                    )
                }
            // to stop the objects from flashing when removed and only skrink > 10 radius enemies
                if (enemy.radius - 10 > 5) {
                    //increase score
                    score += 100 
                    scoreEL.innerHTML = score 

                    //Create smoother skrink effect
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(pjindex, 1)
                    }, 0)
                } else {
                setTimeout(() => {
                    let bighit = new sound("bigprojectilehitted.wav")
                    //increase score (bonus for completely shoot the big projectile)
                    score += 250 
                    scoreEL.innerHTML = score 
                        enemies.splice(index, 1)
                        projectiles.splice(pjindex, 1)
                    }, 0)
                }
            }
        })
    })
}

function sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src;
    this.play = this.sound.play()
}

var mySound

//Shooting objects
addEventListener('click', (event) => {
    /**calculate the angle from the right triangle create with hypoteneus 
    from the center of the player to the position of the clicked point.**/
    const angle = Math.atan2(
        event.clientY - cvs.height / 2,
        event.clientX - cvs.width / 2
        )
    //Calulate ratio to push the projectitle whereever the screen is clicked
    const velocity = {
            x: Math.cos(angle) * 5, //x adjacent axis
            y: Math.sin(angle) * 5 //y adjacent axis
        }
    projectiles.push(new Projectile(cvs.width / 2, cvs.height / 2, 5, 'pink', velocity))
    //adding shooting sound effect
    var mySound = new sound("shootingsound.wav")
})

startgamebtn.addEventListener('click',() => {
    let bgsound = new sound("dark-secrets-of-the-universe-5745.mp3")
    init()
    animate()
    spawnEnemies()
    frameEL.style.display = 'none'
})
