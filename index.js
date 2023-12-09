const jogo = document.getElementById("jogo")
const canos = document.getElementById("canos")
const chao = document.getElementById("chao")
let passaro = document.getElementById("passaro")
let gameOver = false
let intervaloGeradorDeCanos, intervalo
let estaPulado = false

function gerarCanos() {
    const altura1 = Math.floor(Math.random() * 370)
    const altura2 = 400 - altura1 + 30

    let topo = document.createElement("div")
    topo.classList.add("cano")
    topo.classList.add("cano-alto")
    topo.style.height = altura1 + "px"

    let baixo = document.createElement("div")
    baixo.classList.add("cano")
    baixo.classList.add("cano-baixo")
    baixo.style.height = altura2 + "px"
    baixo.style.bottom = (screen.height - chao.getBoundingClientRect().bottom - 88) + "px"

    canos.appendChild(topo)
    canos.appendChild(baixo)

    topo.addEventListener("animationend", () => {
        topo.remove()
    })

    baixo.addEventListener("animationend", () => {
        baixo.remove()
    })
}

function iniciarJogo() {
    $("#fim-de-jogo").css("visibility", "hidden")

    $(canos).empty()

    $(passaro).css('top', `100px`)

    gameOver = false

    chao.style.animationPlayState = 'running'

    Array.from(document.querySelectorAll('.cano')).forEach(function (cano) {
        cano.style.animationPlayState = 'running'
    })

    intervaloGeradorDeCanos = setInterval(() => {
        gerarCanos()
    }, 1500)

    intervalo = setInterval(() => {
        passaro = document.getElementById("passaro")

        if (colidiu(passaro, chao) || colidiuComCano(passaro, "cano"))
            finalizarJogo()
    }, 10)

    movimentoPassaro()
}

function finalizarJogo() {
    gameOver = true

    clearInterval(intervalo)
    clearInterval(intervaloGeradorDeCanos)

    chao.style.animationPlayState = 'paused'

    Array.from(document.querySelectorAll('.cano')).forEach(function (cano) {
        cano.style.animationPlayState = 'paused'
    })

    $("#fim-de-jogo").css("visibility", "visible")
}

function movimentoPassaro() {
    const gravidade = 0.05
    let alturaAtual = 0
    let velocidade = 0

    function pular() { 
        velocidade = -Math.sqrt(2 * gravidade * 100);
    }

    function atualizar() {
        velocidade += gravidade
        alturaAtual += velocidade

        passaro.style.top = alturaAtual + "px"

        if (alturaAtual < 530) requestAnimationFrame(atualizar)
    }

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 32 && !gameOver) pular()
    })

    atualizar()
}

$("#reiniciar").click(function () {
    iniciarJogo()
})

/* Util */

function colidiu(a, b) {
    var aRect = a.getBoundingClientRect()
    var bRect = b.getBoundingClientRect()

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    )
}

function colidiuComCano(passaroDiv, classe) {
    const canos = document.querySelectorAll(`.${classe}`);

    for (const cano of canos) {
        if (colidiu(passaroDiv, cano))
            return true
    }

    return false
}

iniciarJogo() 