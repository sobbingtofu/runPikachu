export const timerPromiseLogic = (time: number) => {
  const timerPromise = new Promise<void>((resolve) =>
    setTimeout(resolve, time),
  );
  return timerPromise;
};
