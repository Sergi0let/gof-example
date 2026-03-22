# typescript-exmpl

Educational examples of classic Gang of Four design patterns in **TypeScript**. Code is grouped by category; subfolders hold different problem domains plus basic and advanced variants.

## Requirements

- [Node.js](https://nodejs.org/) **18+** (current LTS recommended)
- npm (bundled with Node)

## Quick start

```bash
git clone <your-repo-url>
cd typescript-exmpl
npm install
```

Run a single example (no build step):

```bash
npx tsx patterns/creational/singleton/logger.ts
```

Use any other `.ts` file under `patterns/` by changing the path.

## Repository layout

```
patterns/
├── creational/          # Creational patterns
│   ├── singleton/       # Single instance, logger examples, etc.
│   ├── factory/         # Factory / factory method (notification, simple-factory)
│   └── factory-abstract/
│       └── notification.ts
└── behavioral/
    └── strategy/        # Strategy: interchangeable algorithms
        ├── auth/
        ├── navigation-plan/   # problem statements in .md + .ts samples
        └── pricing-system/
```

Subfolders under `strategy/` are different contexts (auth, routing, pricing). Files with an **`advanced`** suffix are extended or harder versions next to the basics.

## Code formatting

This repo uses [Prettier](https://prettier.io/).

```bash
npm run format        # format the whole repo
npm run format:check  # check only (handy for CI)
```

## Learning progress

### Already in this repo

**Creational**

- [x] **Singleton** — `patterns/creational/singleton/`
- [x] **Simple Factory** — `patterns/creational/factory/simple-factory.ts`
- [x] **Factory Method** (notifications example) — `patterns/creational/factory/notification.ts`
- [x] **Abstract Factory** — `patterns/creational/factory-abstract/notification.ts`

**Structural**

- _No examples in the repo yet._

**Behavioral**

- [x] **Strategy** — `patterns/behavioral/strategy/` (auth, navigation-plan, pricing-system; basic and advanced files)

### Next (roadmap)

**Creational**

- [ ] **Builder** — step-by-step construction of complex objects
- [ ] **Prototype** — clone / copy configurations instead of rebuilding from scratch

**Structural**

- [ ] **Adapter** — wrap an incompatible interface to match what clients expect
- [ ] **Decorator** — add behavior dynamically without subclass explosion
- [ ] **Facade** — one simple entry point over a messy subsystem
- [ ] **Proxy** — stand-in for expensive or remote resources (lazy load, access control)
- [ ] **Flyweight** — share immutable state to support many similar objects

**Behavioral**

- [ ] **Observer** — events and subscriptions / publish–subscribe
- [ ] **Command** — encapsulate requests (undo queues, job dispatch)
- [ ] **State** — object behavior changes when internal state changes
- [ ] **Template Method** — fixed algorithm skeleton with overridable steps
- [ ] **Chain of Responsibility** — pass a request along a chain until someone handles it
- [ ] **Mediator** — central hub so components do not talk to each other directly
- [ ] **Memento** — snapshot and restore object state (undo/history)
- [ ] **Iterator** — sequential access without exposing internal structure
- [ ] **Visitor** — new operations on a stable object structure without editing every class
- [ ] **Interpreter** — grammar + parse tree for mini-languages (use sparingly)

Update the checklist when you add new examples.

## License

[ISC License](LICENSE) — permissive and minimal: use the code freely; the only requirement is keeping the copyright and permission notice. Same as the `license` field in [`package.json`](package.json).
