class Semaphore {
    constructor(initialCount = 1) {
        this.count = initialCount;
        this.waitQueue = [];
    }

    acquire() {
        if (this.count > 0) {
            this.count--;
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                this.waitQueue.push(resolve);
            });
        }
    }

    release() {
        if (this.waitQueue.length > 0) {
            const nextProcess = this.waitQueue.shift();
            nextProcess();
        } else {
            this.count++;
        }
    }
}

class Philosopher {
    constructor(name, leftFork, rightFork, semaphore) {
        this.name = name;
        this.leftFork = leftFork;
        this.rightFork = rightFork;
        this.semaphore = semaphore;
        this.state = 'thinking';
        this.element = document.createElement('div');
        this.element.classList.add('philosopher');
        this.element.philosopher = this; // Associate philosopher object with the DOM element
        this.updateUI();
        document.getElementById('philosophers-container').appendChild(this.element);
    }

    async eat() {
        this.state = 'waiting';
        this.updateUI();
        await this.sleep(1000); // Delay for visibility
    
        await this.semaphore.acquire();
        await this.pickUpForks();
    
        this.state = 'eating';
        this.updateUI();
        //console.log(`${this.name} is eating`);
        await this.sleep(2000); // Delay for visibility
    
        await this.putDownForks();
        this.state = 'thinking';
        this.updateUI();
        await this.sleep(1000); // Delay for visibility
    
        this.semaphore.release();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    async pickUpForks() {
        await this.leftFork.acquire();
        await this.rightFork.acquire();
    }

    async putDownForks() {
        this.leftFork.release();
        this.rightFork.release();
    }

    updateUI() {
        //console.log('upd');
        const stateClass = this.state === 'eating' ? 'eating' : this.state === 'thinking' ? 'thinking' : 'waiting';
        this.element.innerHTML = `<div>${this.name}</div><div class="${stateClass}">${this.state}</div>`;
    }
}


document.addEventListener("DOMContentLoaded", function(){
    
    const simulate = document.getElementById('simulate');

    simulate.addEventListener("click", function(){
        const numPhilosophers = parseInt(document.getElementById('phils').value);
        const forks = Array.from({ length: numPhilosophers }, () => new Semaphore(1));
        const semaphore = new Semaphore(numPhilosophers - 1);
        document.getElementById('philosophers-container').innerHTML="";

        for (let i = 0; i < numPhilosophers; i++) {
            const leftFork = forks[i];
            const rightFork = forks[(i + 1) % numPhilosophers];
            new Philosopher(`Philosopher ${i}`, leftFork, rightFork, semaphore);
        }

        async function simulateDinner() {
            const philosophers = Array.from(document.querySelectorAll('.philosopher'));
            const eatingPromises = philosophers.map(philosopherElement => {
                const philosopher = philosopherElement.philosopher;
                return philosopher.eat();
            });
            await Promise.all(eatingPromises);
            document.getElementById('philosophers-container').innerHTML+="All philosophers have finished dining";
            //console.log('All philosophers have finished dining.');
        }
        simulateDinner();
        }
    )
})

