// 1. Спільний інтерфейс для всіх героїв
interface IHero {
  name: string;
  life: number;
  greeting(): void;
}

// 2. Базовий клас для усунення дублювання (DRY)
abstract class Hero implements IHero {
  constructor(
    public name: string,
    public life: number
  ) {
    this.greeting();
  }

  abstract greeting(): void; // Кожен клас реалізує вітання по-своєму
}

class Knight extends Hero {
  greeting() {
    console.log(`🛡️ I'm ${this.name}, a Knight with ${this.life} HP.`);
  }
}

class Wizard extends Hero {
  greeting() {
    console.log(`🔮 I'm ${this.name}, a Wizard with ${this.life} HP.`);
  }
}

// 3. Типізована Фабрика
type HeroType = "knight" | "wizard";

function makeHero(type: HeroType, name: string, life: number): IHero {
  const heroes = {
    knight: Knight,
    wizard: Wizard,
  };

  const HeroClass = heroes[type];
  return new HeroClass(name, life);
}

// Використання
const artur = makeHero("knight", "Artur", 100);
const merlin = makeHero("wizard", "Merlin", 30);
