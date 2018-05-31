import Genetic from 'genetic-lib'
import './style.scss'

const elm = {
  headerRow: document.getElementById('solution-table-header-row'),
  solutionTable: document.getElementById('solution-table'),
  solveButton: document.getElementById('solve'),
  target: document.getElementById('target')
}

// Target solution
let solution = null

// CSS classes
const css = {
  correctSolution: 'correct-solution',
  dataRow: 'data-row'
}

function init () {
  elm.solveButton.addEventListener('click', () => {
    solution = elm.target.value
    elm.solveButton.disabled = true
    run()
  })
}

const seed = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyz1234567890'
  let seed = ''
  for (let i = 0; i < solution.length; i++) {
    seed += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return seed
}

function mutate (DNA) {
  const replaceAt = (str, index, character) => {
    return str.substring(0, index) + character + str.substring(index + 1)
  }

  let i = Math.floor(Math.random() * DNA.length)
  return replaceAt(
    DNA,
    i,
    String.fromCharCode(
      DNA.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)
    )
  )
}

function crossover (mother, father) {
  let ca = Math.floor(Math.random() * mother.length)
  let cb = Math.floor(Math.random() * mother.length)

  if (ca > cb) {
    let tmp = cb
    cb = ca
    ca = tmp
  }

  const son =
    father.substring(0, ca) + mother.substring(ca, cb) + father.substring(cb)
  const daughter =
    mother.substring(0, ca) + father.substring(ca, cb) + mother.substring(cb)

  return [son, daughter]
}

const fitness = DNA => {
  let fitness = 0
  for (let i = 0; i < DNA.length; i++) {
    // Fitness score is increased by 1/distance+1, e.g. 1 for exact matches, 1/2 for distance of 1, 1/3 for distance of 2, etc.
    fitness += 1 / (Math.abs(DNA.charCodeAt(i) - solution.charCodeAt(i)) + 1)
  }
  return fitness
}

const notification = stats => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const row = createRowFromStats(stats)
      elm.headerRow.parentNode.insertBefore(
        row,
        elm.headerRow.nextElementSibling
      )
      resolve()
    }, 0)
  })
}

function createRowFromStats (stats) {
  const row = document.createElement('tr')
  row.classList.add(css.dataRow)
  if (stats.isFinished) {
    row.classList.add(css.correctSolution)
  }
  const generationCell = document.createElement('td')
  generationCell.innerHTML = stats.generation
  const fittestCell = document.createElement('td')
  fittestCell.innerHTML = stats.fittestEver.DNA
  const fitnessCell = document.createElement('td')
  fitnessCell.innerHTML = `${(
    stats.population[0].fitness /
    solution.length *
    100
  ).toFixed(2)}%`
  row.appendChild(generationCell)
  row.appendChild(fittestCell)
  row.appendChild(fitnessCell)
  return row
}

const isFinished = stats => {
  return stats.fittestEver.fitness === solution.length
}

const onFinished = () => {
  elm.solveButton.disabled = false
}

const initSimulation = () => {
  resetSolutionTable()
}

function resetSolutionTable () {
  const dataRows = elm.solutionTable.getElementsByClassName(css.dataRow)
  for (let i = 0; i < dataRows.length; i++) {
    dataRows[i].parentElement.removeChild(dataRows[i])
  }
}

function run () {
  const settings = {
    init: initSimulation,
    seed: seed,
    mutate: mutate,
    crossover: crossover,
    fitness: fitness,
    notification: notification,
    isFinished: isFinished,
    onFinished: onFinished,
    populationSize: 200,
    mutationIterations: 1,
    skip: 5,
    optimise: 'max',
    initialFitness: 0,
    numberOfFittestToSelect: 4
  }
  const genetic = new Genetic(settings)
  genetic.solve()
}

init()
