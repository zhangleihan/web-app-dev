# 建立太空游戏 Part 3：加入动作

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/33?loc=zh_tw)

有外星人在移动的游戏才会好玩！在这款游戏中，我们会建立两种移动模式：

- **键盘滑鼠的移动**：当使用者控制键盘或滑鼠时，能移动画面上的物件。
- **游戏内建的移动**：游戏能自动地在一定时间内，移动其中的物件。

那我们该如何移动画面上的物件呢？这都取决于笛卡尔座标系：我们改变物件的座标 (x,y)，并在画面上重新绘制出来。

通常你需要下列流程来*移动*画面上的物件：

1. **设定物件的新地点**，你才能察觉到物件有所移动。
2. **清除画面**，每一次的绘制间都需要将画面清除干净。我们可以绘制一张背景色的矩形来覆盖画面。
3. **在新地点重新绘制物件**，我们就能移动物件，从 A 点移动到 B 点。

合理的程式码如下所示：

```javascript
// 设定英雄位置
hero.x += 5;
// 利用矩形清除英雄
ctx.clearRect(0, 0, canvas.width, canvas.height);
// 重新绘制背景与英雄
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = "black";
ctx.drawImage(heroImg, hero.x, hero.y);
```

✅ 你能了解为什么在同一秒内多次重新绘制英雄会影响效能的原因吗？阅读[其他种同目的之设计模式](https://www.html5rocks.com/en/tutorials/canvas/performance/)。

## 处理键盘事件

连接特定事件到程式中，你就能处理游戏事件。键盘事件可以在视窗被选择时触发，而滑鼠事件如 `click`，则要点击特定的物件。我们会在这个专案中，使用键盘物件。

要处理一种事件，需要使用视窗的 `addEventListener()` 方法，并提供给它两个参数。第一个参数是事件的名称，例如： `keyup`。第二个参数是回应事件结果的被呼叫函式。

下列是一种例子：

```javascript
window.addEventListener('keyup', (evt) => {
  // `evt.key` = 按键字串
  if (evt.key === 'ArrowUp') {
    // 做某事
  }
})
```

键盘事件有两个属性来判别被按压的按键：

- `key`，使用字串名称表达该按键，例如： `ArrowUp`。
- `keyCode`，使用数字呈现，例如 `37` 会对应到 `ArrowLeft`。

✅ 除了游戏开发以外，键盘事件也是十分实用的功能。你能想到其他使用相同技术的应用吗？

### 特殊按键之限制

有许多*特殊*按键会影响视窗。这代表若我们正监听著 `keyup` 事件，这个按键同时也会执行视窗的滚动行为。某些时候你会需要*关闭*这些浏览器中预设的行为，好比是建立这款游戏时。你需要下列的程式：

```javascript
let onKeyDown = function (e) {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40: // 方向键
    case 32:
      e.preventDefault();
      break; // 空白键
    default:
      break; // 不阻止其他按键
  }
};

window.addEventListener('keydown', onKeyDown);
```

上述的程式码能确保方向键与空白键关闭*预设*的行为。这个*关闭*机制会在我们呼叫 `e.preventDefault()` 时触发。

## 游戏内建的移动

我们可以让物件自己移动，利用计时器如 `setTimeout()` 或是 `setInterval()` 这两个函式，随著秒数间隔更新物件的位置。如下方呈现：

```javascript
let id = setInterval(() => {
  // 在 y 轴上移动敌人
  enemy.y += 10;
})
```

## 游戏回圈

游戏回圈是个重要概念，定期地呼叫必须执行的函式。之所以被称作游戏回圈也是基于所有东西会在一个回圈中呈现给玩家。游戏回圈会利用到所有的游戏物件，并依据各个情况与理由决定是否要绘制出它们。举例来说，当一个敌人被雷射击中，爆炸了。他就不应该存在于现在的游戏回圈中。你会在后续的课程学到更多此概念。

这是一个游戏回圈的基本格式，以程式码表达如下：

```javascript
let gameLoopId = setInterval(() =>
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawHero();
    drawEnemies();
    drawStaticObjects();
}, 200);
```

上述的回圈会每 `200` 毫秒重新绘制 Canvas。你能自由地判断哪种时长更适合套用在你的游戏中。

## 继续我们的太空游戏

你会利用现有的程式码来扩增我们的专案。你可以使用你在 Part I 完成的程式，或是使用 [Part II - Starter](../your-work) 这包程式。

- **移动英雄**：你需要加入程式，确保你可以使用方向键来移动主角。
- **移动敌人**：你也需要加入程式，确保敌人能定期地由上往下移动。

## 建议步骤

在你的 `your-work` 子资料夹中，确认档案是否建立完成。它应该包括：

```bash
-| assets
  -| enemyShip.png
  -| player.png
-| index.html
-| app.js
-| package.json
```

开始 `your_work` 资料夹中的专案，输入：

```bash
cd your-work
npm start
```

这会启动 HTTP 伺服器并发布网址 `http://localhost:5000`。开启浏览器并输入该网址，现在它能呈现英雄以及所有的敌人，但它们还没办法移动！

### 加入程式码

1. **加入特定物件** `hero`、`enemy` 和 `game object`，它们皆有 `x` 与 `y` 位置属性。(记得课程[继承与组合](../../translations/README.zh-tw.md)中的片段)。 

   *提示* `game object` 要有 `x` 和 `y`，以及绘制到画布上的能力。

   >要点：开始建立 GameObject class ，结构如下所示，再绘制到画布上：
  
    ```javascript
        
    class GameObject {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
      }
    
      draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
    ```

    现在，延伸 GameObject 来建立英雄与敌人。
    
    ```javascript
    class Hero extends GameObject {
      constructor(x, y) {
        ...it needs an x, y, type, and speed
      }
    }
    ```

    ```javascript
    class Enemy extends GameObject {
      constructor(x, y) {
        super(x, y);
        (this.width = 98), (this.height = 50);
        this.type = "Enemy";
        let id = setInterval(() => {
          if (this.y < canvas.height - this.height) {
            this.y += 5;
          } else {
            console.log('Stopped at', this.y)
            clearInterval(id);
          }
        }, 300)
      }
    }
    ```

2. **加入键盘事件处理器**以处理键盘输入(移动英雄的上下左右)

   *记住* 这是笛卡尔座标系，左上方为 `0,0`。也请记得关闭键盘的*预设行为*

   >要点：建立函式 onKeyDown 并连接到视窗中：

   ```javascript
    let onKeyDown = function (e) {
          console.log(e.keyCode);
            ...add the code from the lesson above to stop default behavior
          }
    };

    window.addEventListener("keydown", onKeyDown);
   ```
    
   这时候检查你的浏览器命令栏，看看是否能侦测到键盘输入。

3. **建立**[发布订阅模式](../../translations/README.zh-tw.md)，这能让剩下的程式段落保持干净。

   要做到此步骤，你可以：

   1. **建立视窗的事件监听者**：

       ```javascript
        window.addEventListener("keyup", (evt) => {
          if (evt.key === "ArrowUp") {
            eventEmitter.emit(Messages.KEY_EVENT_UP);
          } else if (evt.key === "ArrowDown") {
            eventEmitter.emit(Messages.KEY_EVENT_DOWN);
          } else if (evt.key === "ArrowLeft") {
            eventEmitter.emit(Messages.KEY_EVENT_LEFT);
          } else if (evt.key === "ArrowRight") {
            eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
          }
        });
        ```

    1. **建立 EventEmitter class** 以发布及订阅讯息：

        ```javascript
        class EventEmitter {
          constructor() {
            this.listeners = {};
          }
        
          on(message, listener) {
            if (!this.listeners[message]) {
              this.listeners[message] = [];
            }
            this.listeners[message].push(listener);
          }
        
          emit(message, payload = null) {
            if (this.listeners[message]) {
              this.listeners[message].forEach((l) => l(message, payload));
            }
          }
        }
        ```

    1. **建立常数**并设定 EventEmitter：

        ```javascript
        const Messages = {
          KEY_EVENT_UP: "KEY_EVENT_UP",
          KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
          KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
          KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
        };
        
        let heroImg, 
            enemyImg, 
            laserImg,
            canvas, ctx, 
            gameObjects = [], 
            hero, 
            eventEmitter = new EventEmitter();
        ```

    1. **初始化游戏**

    ```javascript
    function initGame() {
      gameObjects = [];
      createEnemies();
      createHero();
    
      eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -=5 ;
      })
    
      eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
      });
    
      eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
      });
    
      eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
      });
    }
    ```

1. **设定游戏回圈**

   重构函式 window.onload 来初始化游戏，设定游戏回圈的定时间隔。你还需要加入雷射光：

    ```javascript
    window.onload = async () => {
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");
      heroImg = await loadTexture("assets/player.png");
      enemyImg = await loadTexture("assets/enemyShip.png");
      laserImg = await loadTexture("assets/laserRed.png");
    
      initGame();
      let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
      }, 100)
      
    };
    ```

5. **加入程式**来定期地移动敌人

    重构函式 `createEnemies()` 以建立敌人们，接到 gameObjects 中：

    ```javascript
    function createEnemies() {
      const MONSTER_TOTAL = 5;
      const MONSTER_WIDTH = MONSTER_TOTAL * 98;
      const START_X = (canvas.width - MONSTER_WIDTH) / 2;
      const STOP_X = START_X + MONSTER_WIDTH;
    
      for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
          const enemy = new Enemy(x, y);
          enemy.img = enemyImg;
          gameObjects.push(enemy);
        }
      }
    }
    ```
    
    新增函式 `createHero()` 来为英雄做相同的事情。
    
    ```javascript
    function createHero() {
      hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
      );
      hero.img = heroImg;
      gameObjects.push(hero);
    }
    ```

    最后，建立函式 `drawGameObjects()` 以开始绘制：

    ```javascript
    function drawGameObjects(ctx) {
      gameObjects.forEach(go => go.draw(ctx));
    }
    ```

    你的敌人开始会朝你的英雄舰艇前进！

---

## 🚀 挑战

如你所见，在加入零零总总的函式、变数与 class 后，你的程式变成了「面条式代码(spaghetti code)」。你能有效的编排你的程式，让它更容易被阅读？勾划出一个系统来组织你的程式码，即使所有东西都在一个档案中。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/34?loc=zh_tw)

## 复习与自学

我们并没有使用框架(frameworks)来编写我们的游戏，现在有许多 JavaScript 基底的 Canvas 框架，提供给游戏开发使用。花点时间[阅读这些框架](https://github.com/collections/javascript-game-engines)。

## 作业

[为你的程式做注解](assignment.zh-cn.md)
