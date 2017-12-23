import Genetic from './Genetic';

class GeneticStringSolver {
    constructor() {
        this.settings = {};
        this._initFunction = this._initFunction.bind(this);
        this._seed = this._seed.bind(this);
        this._mutate = this._mutate.bind(this);
        this._crossover = this._crossover.bind(this);
        this._fitness = this._fitness.bind(this);
        this._notification = this._notification.bind(this);
        this._isFinished = this._isFinished.bind(this);
        this._onFinished = this._onFinished.bind(this);
    }

    _seed() {
        
    };

    _mutate(entity, iterations = 1) {
        
    };

    _crossover(mother, father) {
        
    };

    _fitness(DNA) {
        
    };

    _notification(stats) {
        
    };

    _isFinished(stats) {
        
    }

    _onFinished(stats) {
        
    };

    _initFunction() {
        
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
                // size: this.userData.populationSize,
                mutationIterations: 5,
                skip: 1,
                optimise: 'min',
                initialFitness: 1111,
                numberOfFittestToSelect: 4,
                killTheWeak: true,
            },
            isFinished: this._isFinished,
            onFinished: this._onFinished
        };

        const genetic = new Genetic(this.settings);

		genetic.evolve();
    }
}

export default GeneticStringSolver;