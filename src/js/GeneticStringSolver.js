import Genetic from 'genetic-lib';

class GeneticStringSolver {
    constructor() {
        this.settings = {};
        this.userData = {};
        this._run = this._run.bind(this);
        this._initFunction = this._initFunction.bind(this);
        this._seed = this._seed.bind(this);
        this._mutate = this._mutate.bind(this);
        this._crossover = this._crossover.bind(this);
        this._fitness = this._fitness.bind(this);
        this._notification = this._notification.bind(this);
        this._isFinished = this._isFinished.bind(this);
        this._onFinished = this._onFinished.bind(this);
    }

    init() {
        document.getElementById('solve').addEventListener('click', () => {
            this.userData.solution = document.getElementById('target').value;
            this._run();
        });
    }

    _seed() {
        const charset = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let seed = '';
        for (let i = 0; i < this.userData.solution.length; i++) {
            seed += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return seed;
    };

    _mutate(DNA) {
        const replaceAt = (str, index, character) => {
            return str.substring(0, index) + character + str.substring(index + 1);
        };

        let i = Math.floor(Math.random() * DNA.length);
        return replaceAt(DNA, i, String.fromCharCode(DNA.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)));
    };

    _crossover(mother, father) {
        const length = mother.length;
        let ca = Math.floor(Math.random() * length);
        let cb = Math.floor(Math.random() * length);

        if (ca > cb) {
            let tmp = cb;
            cb = ca;
            ca = tmp;
        }

        const son = father.substring(0, ca) + mother.substring(ca, cb) + father.substring(cb);
        const daughter = mother.substring(0, ca) + father.substring(ca, cb) + mother.substring(cb);

        return [son, daughter];
    };

    _fitness(DNA) {
        let fitness = 0;
        for (let i = 0; i < DNA.length; i++) {
            // Fitness score is increased by 1/distance+1, e.g. 1 for exact matches, 1/2 for distance of 1, 1/3 for distance of 2, etc.
            fitness += (1 / (Math.abs(DNA.charCodeAt(i) - this.userData.solution.charCodeAt(i)) + 1));
        }
        return fitness;
    };

    _notification(stats) {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                const row = document.createElement('tr');
                row.classList.add('data-row');
                if (stats.isFinished) {
                    row.classList.add('correct-solution');
                }
                const generationCell = document.createElement('td');
                generationCell.innerHTML = stats.generation;
                const fittestCell = document.createElement('td');
                fittestCell.innerHTML = stats.fittestEver.DNA;
                const fitnessCell = document.createElement('td');
                fitnessCell.innerHTML = `${(stats.population[0].fitness / this.userData.solution.length * 100).toFixed(2)}%`;
                row.appendChild(generationCell);
                row.appendChild(fittestCell);
                row.appendChild(fitnessCell);
                const headerRow = document.getElementById('solution-table-header-row');
                headerRow.parentNode.insertBefore(row, headerRow.nextElementSibling);
                resolve();
            }, 0);
        });
    };

    _isFinished(stats) {
        return stats.fittestEver.fitness === this.userData.solution.length;
    }

    _onFinished(stats) {};

    _initFunction() {
        const resetSolutionTable = () => {
            const dataRows = document.querySelectorAll('#solution-table .data-row');
            for(let i = 0; i < dataRows.length; i++) {
                dataRows[i].parentElement.removeChild(dataRows[i]);
            }
        }

        resetSolutionTable();
    };

    _run() {
        this.settings = {
            initFunction: this._initFunction,
            geneticFunctions: {
                seed: this._seed,
                mutate: this._mutate,
                crossover: this._crossover,
                fitness: this._fitness,
                notification: this._notification
            },
            config: {
                size: 200,
                mutationIterations: 1,
                skip: 10,
                optimise: 'max',
                initialFitness: 0,
                numberOfFittestToSelect: 4
            },
            isFinished: this._isFinished,
            onFinished: this._onFinished
        };

        const genetic = new Genetic(this.settings);

		genetic.solve();
    }
}

export default GeneticStringSolver;