# 建立太空游戏 Part 6：结束与重来

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/39?loc=zh_tw)

有许多方式可以表达游戏中的*结束状态*。这都取决于你这位游戏开发者，定义游戏结束的理由。假设我们讨论这款已经开发许久的太空游戏，以下是游戏结束的理由：

- **`N` 艘敌军舰艇被击毁**：如果你想将游戏分成许多关卡，一种常见的方式是将每一关的破关门槛，定为击毁 `N` 艘敌军舰艇。
- **你的船舰已被击毁**：一定有游戏，只要你的船舰被击毁一次时，便判定你输了这场游戏。另一种可行概念是加入生命值系统。每次你的船舰被击毁时，会扣除一条生命。一但你损失了所有性命，你便输了这场游戏。
- **你已经取得 `N` 点分数**：另一种常见的结束状态为分数门槛。取得分数的机制取决在你，常见的条件为摧毁敌舰、或是收集敌舰所*掉落*的道具。
- **完成关卡**：这或许会涉及到许多种状态，好比说： `X` 艘舰艇已被击毁、已取得 `Y` 点分数或是收集特定的道具。

## 重新游戏

如果玩家很享受你的游戏，他们会想再重新游玩一次。一旦因任何原因结束游戏时，你应该要提供重新游戏的方法。

✅ 想想看，什么条件下会结束一款游戏，而它们又是如何提示你重新游玩。

## 建立目标

你需要为你的游戏新增这些规则：

1. **赢得游戏**。 一旦所有敌军舰艇被击毁时，你便赢得这场游戏。请额外地显示胜利讯息。
1. **重新开始**。 一旦你损失了所有性命，或是赢得了胜利，你应该提供方法来重新游戏。记住！你需要重新初始化你的游戏，所有游戏的历史纪录会被移除。

## 建议步骤

在你的 `your-work` 子资料夹中，确认档案是否建立完成。它应该包括：

```bash
-| assets
  -| enemyShip.png
  -| player.png
  -| laserRed.png
  -| life.png
-| index.html
-| app.js
-| package.json
```

开始 `your_work` 资料夹中的专案，输入：

```bash
cd your-work
npm start
```

这会启动 HTTP 伺服器并发布网址 `http://localhost:5000`。开启浏览器并输入该网址。你的游戏应该能被游玩。

> 要点： 要避免在 Visual Studio Code 里出现警告讯息，编辑函式 `window.onload` 以 is，而非 let 的方式呼叫 `gameLoopId`；并在档案正上方独立地宣告 gameLoopId： `let gameLoopId;`。

### 加入程式码

1. **追踪结束状态**。 新增程式码来追踪敌人的数量，利用下列函式判断英雄舰艇是否被击毁：

    ```javascript
    function isHeroDead() {
      return hero.life <= 0;
    }

    function isEnemiesDead() {
      const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
      return enemies.length === 0;
    }
    ```

1. **加入讯息处理器**。 编辑 `eventEmitter` 以处理这些状态：

    ```javascript
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.dead = true;
        hero.incrementPoints();

        if (isEnemiesDead()) {
          eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead())  {
          eventEmitter.emit(Messages.GAME_END_LOSS);
          return; // 游戏失败，提前结束
        }
        if (isEnemiesDead()) {
          eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });
    
    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true);
    });
      
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
      endGame(false);
    });
    ```

1. **加入新的讯息**。 新增这些讯息到 Messages 常数中：

    ```javascript
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    ```

2. **加入重新开始的功能** 在按下特定按钮后，程式会重新开始游戏。

   1. **监听 `Enter` 按钮之按压**。 编辑视窗的 eventListener ，监听按键的按压：

    ```javascript
     else if(evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
      }
    ```

   1. **加入重新游戏的讯息**。 加入这段讯息到 Messages 常数中：

        ```javascript
        KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
        ```

1. **制定游戏规则**。 编制下列的游戏规则：

   1. **玩家胜利条件**。 当所有敌军舰艇被击毁时，显示胜利讯息。

      1. 首先，建立函式 `displayMessage()`：

        ```javascript
        function displayMessage(message, color = "red") {
          ctx.font = "30px Arial";
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        }
        ```

      1. 建立函式 `endGame()`：

        ```javascript
        function endGame(win) {
          clearInterval(gameLoopId);
        
          // 设定延迟以确保所有图像皆绘制完成
          setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (win) {
              displayMessage(
                "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
                "green"
              );
            } else {
              displayMessage(
                "You died !!! Press [Enter] to start a new game Captain Pew Pew"
              );
            }
          }, 200)  
        }
        ```

   1. **重新游戏的逻辑**。 当玩家损失所有的性命，或是赢下这场游戏，显示游戏重来的提示。此外，在*重新游玩*按键被按压时，重新游戏(你可以自己决定任一个键盘按键)。

      1. 建立函式 `resetGame()`：

        ```javascript
        function resetGame() {
          if (gameLoopId) {
            clearInterval(gameLoopId);
            eventEmitter.clear();
            initGame();
            gameLoopId = setInterval(() => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "black";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              drawPoints();
              drawLife();
              updateGameObjects();
              drawGameObjects(ctx);
            }, 100);
          }
        }
        ```

     1. 在 `initGame()` 内呼叫 `eventEmitter` 来重新设定游戏：

        ```javascript
        eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
          resetGame();
        });
        ```

     1. 在 EventEmitter 加入函式 `clear()`：

        ```javascript
        clear() {
          this.listeners = {};
        }
        ```

👽 💥 🚀 恭喜你，舰长！你的游戏已经完成了！干得好！ 🚀 💥 👽

---

## 🚀 挑战

加入游戏音效！你能加入音效来提升游戏品质吗？或许在雷射击中敌人，或是在英雄死亡、胜利时发出音效。看看这套[沙盒](https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_audio_play)，了解如何使用 JavaScript 播放音效。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/40?loc=zh_tw)

## 复习与自学

你的功课是建立一款新的小游戏。去探索一些有趣的游戏，决定你想建造的游戏类型。

## 作业

[建立一款游戏](assignment.zh-cn.md)
