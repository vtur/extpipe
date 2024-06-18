# Extpipe
### Tiny package for extended pipe for Node.js functions 

Usage example:
```js
const { pipe } = require("extpipe");

async function getReport(userIds) {
  const { result } = pipe(
    {
        userIds,
        salaryPerHour: 20,
        minimumWorkload: 5,
    },
    [getUsers, 'users'],
    [getUsersWorkloadSum, ['usersWorkloadSum', 'bestWorkloadResult']],
    [addWorkloadSumToUsers, 'users'],
    [formatResult, 'result']
  )
}

async function getUsers({ userIds }) {
  const users = {}
  //getting users with userIds
  return users;
}

async function getUsersWorkloadSum ({ userIds }) {
  //getting data
  return [usersWorkloadSum, bestWorkloadResult];
}
```
Let's take a look on main function:
```js
function pipe(pool: any, ...args: Array<[function: (pool: any) => any, result: string | string[]]>): any;
```
First argument of the function is pool of initial pipe variables which going to be available in any function in the pipe
After pool argument here can be as much args as you want, all of them is arrays with:
  1) executable functions (sync or async), as 1st element of the array 
  2) -name for result which going to be write in the pool, as 2nd element of the array
     -or array of names (in this case function going to return array too and write to variables which names passed in array accordingly, example getUsersWorkloadSum)

##### Promise.all case:
```js
const { pipe } = require("extpipe");

const { result } = pipe(
    {
        usersId: { 1, 2, 5 },
        salaryPerHour: 20,
        minimumWorkload: 5,
    },
    [
      [getUsers, 'users'],
      [getUsersWorkloadSum, 'usersWorkloadSum'],
    ]
    [addWorkloadSumToUsers, 'users'],
    [formatResult, 'result']
)
```
In this case functions getUsers and getUsersWorkloadSum will be executed inside of Promise.all results going to be write in the pool in the same way.
Here is one restriction: results soing to be write in the pool only after getUsers and getUsersWorkloadSum will be complete, so we can't have access to users pool variable in getUsersWorkloadSum

#####  Pipe perfomance:
```js
const { pipePerfomance } = require("extpipe");

const { result } = pipePerfomance(
    {
        usersId: { 1, 2, 5 },
        salaryPerHour: 20,
        minimumWorkload: 5,
    },
    [
      [getUsers, 'users'],
      [getUsersWorkloadSum, 'usersWorkloadSum'],
    ]
    [addWorkloadSumToUsers, 'users'],
    [formatResult, 'result']
)
```
executing as pipe but outputs the console:
```console
group 0: 10ms
addWorkloadSumToUsers: 50ms
formatResult: 20ms
=====>Sum: 80ms
```