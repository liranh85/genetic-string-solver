import Genetic from 'genetic-lib'

class GeneticStringSolver {
  constructor () {
    this.settings = {
      init: this._initSimulation,
      seed: this._seed,
      mutate: this._mutate,
      crossover: this._crossover,
      fitness: this._fitness,
      notification: this._notification,
      isFinished: this._isFinished,
      onFinished: this._onFinished,
      populationSize: 200,
      mutationIterations: 1,
      skip: 5,
      optimise: 'max',
      initialFitness: 0,
      numberOfFittestToSelect: 4
    }
    this.solution = null
    this.elm = {
      headerRow: document.getElementById('solution-table-header-row'),
      solutionTable: document.getElementById('solution-table'),
      solveButton: document.getElementById('solve')
    }
    this.css = {
      correctSolution: 'correct-solution',
      dataRow: 'data-row'
    }
  }

  init () {
    this.elm.solveButton.addEventListener('click', () => {
      this.solution = document.getElementById('target').value
      this.elm.solveButton.disabled = true
      this._run()
    })
  }

  _seed = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let seed = ''
    for (let i = 0; i < this.solution.length; i++) {
      seed += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return seed
  }

  _mutate (DNA) {
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

  _crossover (mother, father) {
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

  _fitness = DNA => {
    let fitness = 0
    for (let i = 0; i < DNA.length; i++) {
      // Fitness score is increased by 1/distance+1, e.g. 1 for exact matches, 1/2 for distance of 1, 1/3 for distance of 2, etc.
      fitness +=
        1 / (Math.abs(DNA.charCodeAt(i) - this.solution.charCodeAt(i)) + 1)
    }
    return fitness
  }

  _notification = stats => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        const row = this._createRowFromStats(stats)
        this.elm.headerRow.parentNode.insertBefore(
          row,
          this.elm.headerRow.nextElementSibling
        )
        resolve()
      }, 0)
    })
  }

  _createRowFromStats (stats) {
    const { css } = this
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
      this.solution.length *
      100
    ).toFixed(2)}%`
    row.appendChild(generationCell)
    row.appendChild(fittestCell)
    row.appendChild(fitnessCell)
    return row
  }

  _isFinished = stats => {
    return stats.fittestEver.fitness === this.solution.length
  }

  _onFinished = () => {
    this.elm.solveButton.disabled = false
  }

  _initSimulation = () => {
    this.resetSolutionTable()
  }

  resetSolutionTable () {
    const dataRows = this.elm.solutionTable.getElementsByClassName(
      this.css.dataRow
    )
    for (let i = 0; i < dataRows.length; i++) {
      dataRows[i].parentElement.removeChild(dataRows[i])
    }
  }

  _run () {
    const genetic = new Genetic(this.settings)
    genetic.solve()
  }
}

export default GeneticStringSolver
