# Extpipe
## Extended pipe for Node.js functions 

Usage example:
```js
const { pipe } = require("extpipe");

const { result } = pipe(
    {
        usersId: { 1, 2, 5 },
        salaryPerHour: 20,
        minimumWorkload: 5,
    },
    [getUsers, 'users'],
    [getUsersWorkloadSum, 'usersWorkloadSum'],
    [addWorkloadSumToUsers, 'users'],
    [formatResult, 'result']
)

more information gonna be here soon
```