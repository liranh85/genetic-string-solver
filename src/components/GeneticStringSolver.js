import Genetic from 'genetic-lib';

class GeneticStringSolver {
  constructor () {
    this.settings = {}
    this.solution = null
  }

  init () {
    document.getElementById('solve').addEventListener('click', () => {
      this.solution = document.getElementById('target').value
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
    const length = mother.length
    let ca = Math.floor(Math.random() * length)
    let cb = Math.floor(Math.random() * length)

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
        const row = document.createElement('tr')
        row.classList.add('data-row')
        if (stats.isFinished) {
          row.classList.add('correct-solution')
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
        const headerRow = document.getElementById('solution-table-header-row')
        headerRow.parentNode.insertBefore(row, headerRow.nextElementSibling)
        resolve()
      }, 0)
    })
  }

  _isFinished = stats => {
    return stats.fittestEver.fitness === this.solution.length
  }

  _initFunction () {
    const resetSolutionTable = () => {
      const dataRows = document.querySelectorAll('#solution-table .data-row')
      for (let i = 0; i < dataRows.length; i++) {
        dataRows[i].parentElement.removeChild(dataRows[i])
      }
    }
    resetSolutionTable()
  }

  _run () {
    this.settings = {
      init: this._initFunction,
      seed: this._seed,
      mutate: this._mutate,
      crossover: this._crossover,
      fitness: this._fitness,
      notification: this._notification,
      isFinished: this._isFinished,
      populationSize: 200,
      mutationIterations: 1,
      skip: 5,
      optimise: 'max',
      initialFitness: 0,
      numberOfFittestToSelect: 4
    }

    const genetic = new Genetic(this.settings)

    genetic.solve()
  }
}

export default GeneticStringSolver
