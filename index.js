const pipe = async (pool,...args) => { 
  for (const arg of args) {
    if (arg[0] instanceof Array)  pool = {...pool, ...await promiseAll(pool, arg)};
    else if (arg[1] instanceof Array)  pool = {...pool, ...await multipleResults(pool, arg)};
    else pool[arg[1]] = await arg[0](pool)
  }
  return pool;
}
const  promiseAll = async (pool, arr) => {
  const result = {};
  const arrOfResults = await Promise.all(arr.map(x=>x[0](pool)));
  arr.forEach((x,i) => {
    result[x[1]] = arrOfResults[i];
  });
  return result;
}
const  multipleResults = async (pool, element) => {
  const result = {};
  const arrOfResults = await element[0](pool);
  arrOfResults.forEach((x,i) => {
    result[element[1][i]] = x;
  });
  return result;
}

const pipePerfomance = async (pool,...args) => {
  let i = 1;
  console.time('=====>Sum')
  for (const arg of args) {
    if (arg[0] instanceof Array)  {
      console.time('group '+i)
      pool = {...pool, ...await promiseAll(pool, arg)};
      console.time('group '+i++)
    } else if (arg[1] instanceof Array)  {
      console.time(arg[0].name)
      pool = {...pool, ...await multipleResults(pool, arg)};
      console.timeEnd(arg[0].name)
    }
    else {
      console.time(arg[0].name)
      pool[arg[1]] = await arg[0](pool)
      console.timeEnd(arg[0].name)
    }
  }
  console.timeEnd('=====>Sum')
  return pool;
}

module.exports = {pipe, pipePerfomance}
