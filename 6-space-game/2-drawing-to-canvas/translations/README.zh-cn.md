# 建立太空游戏 Part 2：在画布上绘制英雄与怪物

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/31?loc=zh_tw)

## Canvas

Canvas 是 HTML 中的元素，预设上不带有任何内容，就如一块白板。你需要自己彩绘上去。

✅ 在 MDN 上阅读[更多关于 Canvas API](https://developer.mozilla.org/docs/Web/API/Canvas_API)。

这是它典型的宣告方式，位在页面的 body 中：

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```

上面我们设定了 `id`、`width` 和 `height`。

- `id`：让你在处理物件时，能快速地取得参考位置。
- `width`：物件的宽度。
- `height`：物件的高度。

## 绘制简单几何图样

Canvas 使用了笛卡尔座标系绘制图案。因此有 x 轴与 y 轴来表达物件的所在地点。座标点 `0,0` 位在画布的左上方；而右下方则是我们定义画布的宽度与高度。

![画布网格](../canvas_grid.png)
> 图片出自于 [MDN](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)

要在 Canvas 物件上绘制图案，你需要执行下列步骤：

1. **取得 Canvas 物件的参考位置**。
1. **取得 Context 物件的参考位置**，定义在 Canvas 元素中。
1. 使用 context 元素**进行绘制动作**。

以程式码表达上述步骤会呈现成：

```javascript
// 绘制红色矩形
//1. 取得 canvas 参考点
canvas = document.getElementById("myCanvas");

//2. 设定 context 为 2D 以绘制基本图形
ctx = canvas.getContext("2d");

//3. 填入色彩红色
ctx.fillStyle = 'red';

//4. 利用这些参数决定位置与大小，绘制矩形
ctx.fillRect(0,0, 200, 200) // x,y,width, height
```

✅ Canvas API 主要是处理 2D 图形，但你也可以在网页中绘制 3D 图形。要完成这个需求，你可以使用 [WebGL API](https://developer.mozilla.org/docs/Web/API/WebGL_API)。

你可以使用 Canvas API 绘制出这些物件：

- **几何图形**，我们已经展示绘制矩形的流程，还有许多种形状可以使用。
- **文字**，你可以绘制文字，决定你想要的字型及颜色。
- **图片**，你可以依据图片档绘制图案，举例来说像是 .jpg 或是 .png 档。

✅ 试试看！你知道如何绘制矩形，你能在页面中绘制圆形吗？看看在 CodePen 上有趣的 Canvas 涂鸦。这边有一样[特别令人惊豔的例子](https://codepen.io/dissimulate/pen/KrAwx)。

## 读取并绘制图片档

建立 `Image` 物件并设定其 `src` 属性，你可以读取图片档。接著监听 `load` 事件，了解图片何时已经可以被使用。程式码如下：

### 读取档案

```javascript
const img = new Image();
img.src = 'path/to/my/image.png';
img.onload = () => {
  // 图片载入完成，准备使用
}
```

### 读取档案之模式

建议上可以将上述程式打包起来，建立成完整的结构，判断图片是否载入完成，也方便未来的使用：

```javascript
function loadAsset(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      // 图片载入完成，准备使用
      resolve(img);
    }
  })
}

// 实际用法

async function run() {
  const heroImg = await loadAsset('hero.png')
  const monsterImg = await loadAsset('monster.png')
}

```

要在画面上绘制游戏物件，你的程式码会如下所示：

```javascript
async function run() {
  const heroImg = await loadAsset('hero.png')
  const monsterImg = await loadAsset('monster.png')

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  ctx.drawImage(heroImg, canvas.width/2,canvas.height/2);
  ctx.drawImage(monsterImg, 0,0);
}
```

## 是时候来建立你的游戏了

### 建立目标

你需要建立包含 Canvas 元素的网页。它会是 `1024*768` 的黑色画面。我们提供了两张图片：

- 英雄舰艇

   ![英雄舰艇](../solution/assets/player.png)

- 5*5 只怪物

   ![敌军舰艇](../solution/assets/enemyShip.png)

### 开始开发的建议步骤

在你的 `your-work` 子资料夹中，确认档案是否建立完成。它应该包括：

```bash
-| assets
  -| enemyShip.png
  -| player.png
-| index.html
-| app.js
-| package.json
```

在 Visual Studio Code 中开启这个资料夹的副本。你需要建立本地端的开发环境，建议为 Visual Studio Code 与安装好的 NPM 与 Node。如果你的电脑中还没设定好 `npm`，[这是它的设定流程](https://www.npmjs.com/get-npm)。

前往 `your_work` 资料夹，开始你的专案：

```bash
cd your-work
npm start
```

这会启动 HTTP 伺服器，网址为 `http://localhost:5000`。开启浏览器并输入该网址。目前会是空白的页面，但不久后就会不一样了。

> 笔记：想观察画面的改变，请重新整理你的页面。

### 加入程式码

在 `your-work/app.js` 中加入程式码以解决下列目标：

1. 在 Canvas **绘制**黑色背景
   > 要点：在 `/app.js` 中，加入两行程式在 TODO 下方：设定 `ctx` 元素为黑色，左上方座标点为 0,0 且大小与 Canvas 相等。
2. **读取**材质
   > 要点：使用 `await loadTexture` 导入图片位置以新增玩家与敌军图片。你还没办法在画面上看到它们！
3. 在画面的正下方**绘制**英雄
   > 要点：使用 `drawImage` API 来绘制 heroImg 到画面上，设定位置为  `canvas.width / 2 - 45` 与 `canvas.height - canvas.height / 4)`。
4. **绘制** 5*5 只怪物
   > 要点：现在移除注解，在画面上绘制敌人。接著编辑函式 `createEnemies`。

    首先，设定几个常数：

    ```javascript
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    ```

    接著，利用回圈在画面上绘制矩阵型态的怪物：

    ```javascript
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
          ctx.drawImage(enemyImg, x, y);
        }
      }
    ```

## 结果

完成后的成果应该如下所示：

![黑画面上有英雄与 5*5 只怪物](../partI-solution.png)

## 解答

试著自己先完成程式码，但如果你遭遇到困难，请参考[解答](../solution/app.js)。

---

## 🚀 挑战

你已经学会绘制 2D 图形的 Canvas API。看看 [WebGL API](https://developer.mozilla.org/docs/Web/API/WebGL_API)，试著绘制 3D 物件。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/32?loc=zh_tw)

## 复习与自学

[阅读更多资料](https://developer.mozilla.org/docs/Web/API/Canvas_API)，学习更多有关 Canvas API 的用法。

## 作业

[把玩 Canvas API](assignment.zh-cn.md)
