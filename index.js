const pipe = async (sharedObject, ...tasks) => {
  for (const task of tasks) {
    const [operation, keys] = task;
    if (Array.isArray(operation)) {
      sharedObject = { ...sharedObject, ...(await executeParallel(sharedObject, task)) };
    } else if (Array.isArray(keys)) {
      sharedObject = { ...sharedObject, ...(await executeMultipleResults(sharedObject, task)) };
    } else {
      sharedObject[keys] = await operation(sharedObject);
    }
  }
  return sharedObject;
};

const executeParallel = async (sharedObject, operations) => {
  console.log(operations);
  const result = {};
  const results = await Promise.all(operations.map(([func]) => func(sharedObject)));
  operations.forEach(([_func, key], i) => {
    result[key] = results[i];
  });
  return result;
};

const executeMultipleResults = async (sharedObject, [operation, keys]) => {
  const result = {};
  const results = await operation(sharedObject);
  keys.forEach((key, i) => {
    result[key] = results[i];
  });
  return result;
};


const pipePerformance = async (sharedObject, ...tasks) => {
  let i = 1;
  console.time('Full Time Of Execute');
  for (const task of tasks) {
    const [operation, keys] = task;
    if (Array.isArray(operation)) {
      console.time('executeParallel ' + i);
      sharedObject = { ...sharedObject, ...(await executeParallel(sharedObject, task)) };
      console.timeEnd('executeParallel ' + i++);
    } else if (Array.isArray(keys)) {
      console.time(operation.name);
      sharedObject = { ...sharedObject, ...(await executeMultipleResults(sharedObject, task)) };
      console.timeEnd(operation.name);
    } else {
      console.time(operation.name);
      sharedObject[keys] = await executeSingle(sharedObject, operation);
      console.timeEnd(operation.name);
    }
  }
  console.timeEnd('Full Time Of Execute');
  return sharedObject;
};

module.exports = { pipe, pipePerformance };