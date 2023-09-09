# 建立太空游戏 Part 5：分数与生命数

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/37?loc=zh_tw)

在这堂课中，你会学习如何为游戏加入计分功能与计算性命数。

## 在画面上绘制文字

为了在画面上显示游戏分数，你需要了解如何配置文字。答案是在 Canvas 物件上使用方法 `fillText()`。你也可以控制其他特征，例如文字字型、文字颜色甚至文字对齐方向(左、右、置中)。下面是在画面中绘制一些文字。

```javascript
ctx.font = "30px Arial";
ctx.fillStyle = "red";
ctx.textAlign = "right";
ctx.fillText("show this on the screen", 0, 0);
```

✅ 阅读更多关于[在画布上建立文字](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial/Drawing_text)，你可以自由地丰富你的文字！

## 性命，一个游戏概念

游戏中的生命概念只是一个数字。在太空游戏中，在你的船舰受到攻击时，扣除生命值是一种常见的方式。如果能以图像的方式显示生命值也是很好的方式，例如船舰图示、心脏图像，而非单纯使用数字。

## 建立目标

我们在游戏中新增下列功能：

- **游戏分数**：当每一艘敌军舰艇被摧毁时，英雄应该取得一些奖励分数，我们建议一艘敌舰一百分。游戏总分应该显示在画面的左下角。
- **生命值**：你的船舰有三条性命。在每一次敌军舰艇撞击你时，你会损失一条性命。生命数应该显示在画面的右下角，以下列图像显示出来。 ![性命图片](../solution/assets/life.png)

## 建议步骤

在你的 `your-work` 子资料夹中，确认档案是否建立完成。它应该包括：

```bash
-| assets
  -| enemyShip.png
  -| player.png
  -| laserRed.png
-| index.html
-| app.js
-| package.json
```

开始 `your_work` 资料夹中的专案，输入：

```bash
cd your-work
npm start
```

这会启动 HTTP 伺服器并发布网址 `http://localhost:5000`。开启浏览器并输入该网址，现在它能显示出英雄与所有的敌人，在你操作方向键后，英雄能移动并击落敌人。

### 加入程式码

1. 从资料夹 `solution/assets/` **复制你需要的档案** 到资料夹 `your-work` 中。你会加入档案 `life.png`。在函式 window.onload 中加入 lifeImg ： 

    ```javascript
    lifeImg = await loadTexture("assets/life.png");
    ```

1. 在档案清单中加入 `lifeImg`：

    ```javascript
    let heroImg,
    ...
    lifeImg,
    ...
    eventEmitter = new EventEmitter();
    ```
  
2. **新增变数**。 加入程式码表达你的游戏总分(0)和剩馀性命(3)，并显示在画面上。

3. **扩增函式 `updateGameObjects()`**。 扩增函式 `updateGameObjects()` 来处理敌军碰撞：

    ```javascript
    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject())) {
          eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
      })
    ```

4. **加入 `life` 与 `points`**. 
   1. **初始化变数**。 在 `Hero` class 的 `this.cooldown = 0` 下方，设定性命与分数：

        ```javascript
        this.life = 3;
        this.points = 0;
        ```

   1. **在画面上显示变数内容**。 在画面上绘制这些数值：

        ```javascript
        function drawLife() {
          // TODO, 35, 27
          const START_POS = canvas.width - 180;
          for(let i=0; i < hero.life; i++ ) {
            ctx.drawImage(
              lifeImg, 
              START_POS + (45 * (i+1) ), 
              canvas.height - 37);
          }
        }
        
        function drawPoints() {
          ctx.font = "30px Arial";
          ctx.fillStyle = "red";
          ctx.textAlign = "left";
          drawText("Points: " + hero.points, 10, canvas.height-20);
        }
        
        function drawText(message, x, y) {
          ctx.fillText(message, x, y);
        }

        ```

   1. **在游戏回圈中加入呼叫**。 请确保你加入这些函式到 `updateGameObjects()` 下方的 window.onload 内：

        ```javascript
        drawPoints();
        drawLife();
        ```

1. **制定游戏规则**。 制定下列的游戏规则：

   1. **在英雄与敌人发生碰撞时**，扣除一条生命。
   
      扩增 `Hero` class 来执行这段减法：

        ```javascript
        decrementLife() {
          this.life--;
          if (this.life === 0) {
            this.dead = true;
          }
        }
        ```

   2. **当雷射击中敌人时**，增加游戏总分一百分。

      扩增 Hero class 来执行这段加法：
    
        ```javascript
          incrementPoints() {
            this.points += 100;
          }
        ```

        加入这些函式到碰撞事件发送器中：

        ```javascript
        eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
           first.dead = true;
           second.dead = true;
           hero.incrementPoints();
        })

        eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
           enemy.dead = true;
           hero.decrementLife();
        });
        ```

✅ 做点研究，探索其他使用到 JavaScript 与 Canvas 的游戏。他们有什么共同特征？

在这个工作的尾声，你应该能在右下方看到「性命」小船；左下方看到游戏总分。当你碰撞到敌人时会扣除生命；当你击落敌人时会增加分数。做得好！你的游戏就快完成了。

---

## 🚀 挑战

你的程式就快完成了。你能预测到下一步吗？

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/38?loc=zh_tw)

## 复习与自学

研究其他种增加与减少分数与生命数的方法。这边有一些有趣的游戏引擎，例如：[PlayFab](https://playfab.com)。使用这些引擎能如何增进你的游戏？

## 作业

[建立计分游戏](assignment.zh-tw.md)
