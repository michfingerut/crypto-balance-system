To be continued...

before
start running the server:

```bash
npm i
npm run start:dev
```

## Test

You can run tests from each directory by the relevant test command that appear in `package.json` file.

```bash
 npm run test
```

will run all `.spec` tests

```bash
 npm run test:e2e
```

will run all `.e2e-spec` tests

```bash
 npm run test:balance-service
```

- make sure to not run all tests togetheer, free coinGeko api has rate-limit

will run all tests of balance-service

2 cache mechanism:

1. rate-service- stores cache of coins rate
2. balance service- stores cache of coins list and existing coins (the idea is to maintain lazy initialization of value + not cache only the list so dont need to iterate the list each time)

## env

there are 2 .env files both for blanace and rate service

- dont forget to run

```bash
npx prettier --write
npm run lint
```

make sure to push with 0 lint erros
