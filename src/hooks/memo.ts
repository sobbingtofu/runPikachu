// 장애물 생성 및 이동
// useEffect(() => {
//   if (!gameState.isGameStarted || gameState.isGameOver) return;

//   const obstacleGenerationInterval = setInterval(() => {
//     const newObstacle: ObstacleType = {
//       id: Date.now(),
//       left: (gameContainerRef.current?.offsetWidth || 800) - 50, // 게임 컨테이너 오른쪽 끝에서 시작
//       type: Math.random() > 0.5 ? 'cactus' : 'bird', // 장애물 종류 랜덤 선택
//     };
//     setGameState((prev) => ({
//       ...prev,
//       obstacles: [...prev.obstacles, newObstacle],
//     }));
//   }, 2000); // 2초마다 장애물 생성

//   // 장애물 이동
//   const obstacleMoveInterval = setInterval(() => {
//     setGameState((prev) => {
//       const updatedObstacles = prev.obstacles
//         .map((obs) => ({ ...obs, left: obs.left - 5 })) // 장애물 속도 조절
//         .filter((obs) => obs.left > -50); // 화면 밖으로 나간 장애물 제거

//       // 점수 증가 (화면 밖으로 나간 장애물 수만큼)
//       const passedObstaclesCount =
//         prev.obstacles.length - updatedObstacles.length;
//       const newScore = prev.score + passedObstaclesCount;

//       return { ...prev, obstacles: updatedObstacles, score: newScore };
//     });
//   }, 20); // 20ms마다 이동

//   return () => {
//     clearInterval(obstacleGenerationInterval);
//     clearInterval(obstacleMoveInterval);
//   };
// }, [gameState.isGameStarted, gameState.isGameOver]);

// 충돌 감지
// useEffect(() => {
//   if (gameState.isGameOver || !gameContainerRef.current) return;

//   const checkCollision = setInterval(() => {
//     const pikachuElement = gameContainerRef.current?.querySelector(
//       '.pikachu',
//     ) as HTMLElement;
//     if (!pikachuElement) return;

//     const pikachuRect = pikachuElement.getBoundingClientRect();

//     for (const obstacle of gameState.obstacles) {
//       const obstacleElement = gameContainerRef.current?.querySelector(
//         `.obstacle[data-id="${obstacle.id}"]`,
//       ) as HTMLElement;
//       if (!obstacleElement) continue;

//       const obstacleRect = obstacleElement.getBoundingClientRect();

//       // 간단한 충돌 감지 로직 (겹치는 영역 확인)
//       if (
//         pikachuRect.left < obstacleRect.right &&
//         pikachuRect.right > obstacleRect.left &&
//         pikachuRect.top < obstacleRect.bottom &&
//         pikachuRect.bottom > obstacleRect.top
//       ) {
//         setGameState((prev) => ({
//           ...prev,
//           isGameOver: true,
//           isGameStarted: false,
//         }));
//         clearInterval(checkCollision); // 게임 오버 시 충돌 감지 중단
//         break;
//       }
//     }
//   }, 10); // 10ms마다 충돌 감지

//   return () => clearInterval(checkCollision);
// }, [gameState.obstacles, gameState.isGameOver, gameContainerRef]);
