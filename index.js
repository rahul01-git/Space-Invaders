const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
canvas.height = innerHeight
canvas.width = innerWidth

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0

        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20,
            }
        }

    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)

        c.save()
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2,
        )

        c.rotate(this.rotation)

        c.translate(
            - player.position.x - player.width / 2,
            - player.position.y - player.height / 2,
        )

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 3.5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }
        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y,
            }
        }

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
}

class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        for(let x=0;x<columns;x++){
            for(let y=0;y<rows;y++){

                this.invaders.push(new Invader({position:{
                    x: x * 30,
                    y: y * 30
                }}))
            }
        }

        this.width = columns * 30
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if(this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
}

let frames = 0
randomInterval = Math.floor(Math.random() * 500 + 500)

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    grids.forEach(grid=>{
        grid.update()
        grid.invaders.forEach(invader =>{
            invader.update({velocity: grid.velocity})
        })
    })
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7
        player.rotation = 0.15
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }
    if(frames % randomInterval === 0){
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }
    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = true
            break
        case ' ':
            // console.log('space')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y,
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                })
            )
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = false
            break
        case ' ':
            // console.log('space')
            break
    }
})