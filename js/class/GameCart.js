import { Products } from "./products.js";

export class GameCart extends Products {

    constructor() {
        super();
        this.cardContainer = document.getElementById('cards-container');
        this.gameContainer = document.getElementById('cart-body');
        this.cardTemplate = document.getElementById('card-template').content;
        this.gameTemplate= document.getElementById('game-template').content;
        this.counter = document.getElementById('counter');
        this.cartGames = [];
        this.fragment = new DocumentFragment();
        this.data = this.getProducts();
    }

    printCartCounter() { 
        if(this.cartGames.length > 0) {
            this.counter.parentNode.style.display = 'block';
            this.counter.textContent = this.cartGames.length;
        } else {
            this.counter.parentNode.style.display = 'none';
        }
    }

    async printCards() {
        const products = await this.data;
        products.map(item => {
            this.cardTemplate.querySelector('.card-img').setAttribute('src', item.image);
            this.cardTemplate.querySelector('.card-title').textContent = item.title;
            this.cardTemplate.querySelector('.card-prise').textContent = `$${item.prise}`;
            this.cardTemplate.querySelector('.card-btn').dataset.id = item.id;
            const cardClone = this.cardTemplate.cloneNode(true);
            this.fragment.appendChild(cardClone);
        });

        this.cardContainer.appendChild(this.fragment);
        this.addCardButtonsListener();
    }

    addCardButtonsListener() {
        const cardButtons = this.cardContainer.querySelectorAll('.card-btn');
        cardButtons.forEach(item => {
            item.addEventListener('click', element => {
                this.addGamesToCartList(element.target.parentNode.parentNode);
            });
        });
    }

    addGamesToCartList(parentNode) {
        const ID = parentNode.querySelector('.card-btn').dataset.id;

        if(!this.cartGames.find(item => item.id === ID)){
            this.cartGames.push({
                id: ID,
                title: parentNode.querySelector('.card-title').textContent,
                prise: this.cleanPrise(parentNode.querySelector('.card-prise').textContent),
                amount: 1 
            });
        } else {
            this.increaseGameAmount(ID);
        }

        this.printCartGames();
    }

    cleanPrise(text) {
        if(text === '') return 0;
        return Number(text.replaceAll('$', ''));
    }

    printCartGames() {
        this.gameContainer.innerHTML = '';
        this.cartGames.forEach(item => {
            this.gameTemplate.getElementById('game-title').textContent = item.title;
            this.gameTemplate.getElementById('game-amount').textContent = item.amount;
            this.gameTemplate.getElementById('game-prise').textContent = `$${item.amount * item.prise}`;
            this.gameTemplate.getElementById('game-add').dataset.id = item.id;
            this.gameTemplate.getElementById('game-remove').dataset.id = item.id;
            this.gameTemplate.getElementById('game-clear').dataset.id = item.id;
            
            const gameItemClone = this.gameTemplate.cloneNode(true);
            this.fragment.appendChild(gameItemClone);
        });

        this.gameContainer.appendChild(this.fragment);
        this.addGameItemListener();
        this.printCartCounter();
        this.printTotalGamesPrise();
    }

    printTotalGamesPrise() {
        const gamesPrises =  [...this.gameContainer.querySelectorAll('#game-prise')];
        const acumPrises = gamesPrises.reduce((acum, item) => acum + this.cleanPrise(item.textContent), 0);
        this.gameContainer.nextElementSibling.querySelector('#acum-prise').textContent = `$${acumPrises}`;
    }

    addGameItemListener() {
        const gameButtons = this.gameContainer.querySelectorAll('.game-actions span');
        gameButtons.forEach(item => {
            item.addEventListener('click', () => {
                const ID = item.dataset.id;
                switch(item.getAttribute('id')) {
                    case 'game-add':
                        this.increaseGameAmount(ID);
                        this.printCartGames();
                        break;
                    case 'game-remove':
                        this.decrementGameAmount(ID);
                        this.printCartGames();
                        break;
                    case 'game-clear':
                        this.deleteGameToCart(ID);
                        this.printCartGames();
                        break;
                }
            });
        });
    }

    increaseGameAmount(ID) {
        this.cartGames.map(item => {
            if(item.id === ID) {
                item.amount += 1;
            }
            return item;
        });
    }

    decrementGameAmount(ID) {
        this.cartGames.map(item => {
            if(item.id === ID) {
                item.amount > 1 ? item.amount -= 1 : item.amount = 1;
            }

            return item;
        });
    }

    deleteGameToCart(ID) {
        this.cartGames = this.cartGames.filter(item => item.id !== ID);
    }
}