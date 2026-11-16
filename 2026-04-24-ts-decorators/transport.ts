// Декораторы в TS
// Добавляем логирование для каждого потомка, переопределяя конструктор в декораторе

// декоратор класса: возвращает новый класс-наследник со своим конструктором
function LogCreation<T extends { new (...args: any[]): {} }>(constructor: T)
{
    return class extends constructor
    {
        constructor(...args: any[])
        {
            super(...args);
            let time: string = new Date().toLocaleTimeString();
            console.log(`[log ${time}] создан объект ${constructor.name}: ${JSON.stringify(this)}`);
        }
    };
}

abstract class Transport
{
    protected speed: number;
    protected costPerKm: number;

    constructor(speed: number, costPerKm: number)
    {
        this.speed = speed;
        this.costPerKm = costPerKm;
    }

    abstract calculateTime(distance: number): number;
    abstract calculateCost(distance: number, weight: number): number;

    public showInfo(distance: number, weight: number): void
    {
        let time: number = this.calculateTime(distance);
        let cost: number = this.calculateCost(distance, weight);

        console.log(`Время: ${time.toFixed(2)} ч`);
        console.log(`Стоимость: ${cost.toFixed(2)} грн`);
    }
}


@LogCreation
class Car extends Transport
{
    constructor()
    {
        super(80, 5); // скорость 80 км/ч, 5 грн за км
    }

    public calculateTime(distance: number): number
    {
        return distance / this.speed;
    }

    public calculateCost(distance: number, weight: number): number
    {
        return distance * this.costPerKm + weight * 0.5;
    }
}


@LogCreation
class Bicycle extends Transport
{
    constructor()
    {
        super(20, 1); // скорость 20 км/ч, 1 грн за км
    }

    public calculateTime(distance: number): number
    {
        return distance / this.speed;
    }

    public calculateCost(distance: number, weight: number): number
    {
        return distance * this.costPerKm + weight * 0.1;
    }
}


@LogCreation
class Cart extends Transport
{
    constructor()
    {
        super(10, 2); // скорость 10 км/ч, 2 грн за км
    }

    public calculateTime(distance: number): number
    {
        return distance / this.speed;
    }

    public calculateCost(distance: number, weight: number): number
    {
        return distance * this.costPerKm + weight * 0.3;
    }
}


let distance: number = 100;
let weight: number = 50;

let car: Transport = new Car();
console.log("Автомобиль:");
car.showInfo(distance, weight);

let bicycle: Transport = new Bicycle();
console.log("Велосипед:");
bicycle.showInfo(distance, weight);

let cart: Transport = new Cart();
console.log("Повозка:");
cart.showInfo(distance, weight);
