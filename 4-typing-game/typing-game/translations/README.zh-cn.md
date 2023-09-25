# 使用事件建立游戏

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/21?loc=zh_tw)

## 事件驱动程式设计

当我们建立专为浏览器设计的应用程式时，我们会提供 Graphical User Interface (GUI) 给用户使用，在我们建立的格式上进行互动。最常见的互动方式是透过点击或输入在多样的物件。开发者面临的问题是，我们不了解用户会何时对这些物件产生互动！

[事件驱动程式设计](https://zh.wikipedia.org/zh-tw/%E4%BA%8B%E4%BB%B6%E9%A9%85%E5%8B%95%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88)是一种程式设计的方式，以建立我们的 GUI。若拆解该名词的话，我们知道主轴关键会是**事件（Event）**。根据 Merriam-Webster，[事件](https://www.merriam-webster.com/dictionary/event)定义为「将发生的事」。它能有效地解决我们面临的问题。我们知道当用户产生互动时，什么程式必须回应其要求，只差在我们不知道用户会何时产生互动。

借由建立新的函式，我们可以标记这段将被运行的程式码。我们回顾一下[程序式程式设计](https://zh.wikipedia.org/wiki/%E8%BF%87%E7%A8%8B%E5%BC%8F%E7%BC%96%E7%A8%8B)，函式会依照顺序一行一行的被运行。这同样也会被实践在事件驱动程式设计上，差别在于**如何**去呼叫这些函式。

要处理这些事件：点击按钮、输入字串等等，我们需注册**事件监听者（Event Listeners）**。事件监听者是函式之一，负责回应当事件触发时，提供相对应的回应。事件监听者可以根据用户的行为，更新使用者介面，呼叫伺服器，或是任何你想要它做的事。我们利用 [addEventListener](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener) 新增事件监听者，提供要被运行的函式。

> **注意** 值得注意我们有许多建立事件监听者的方式。你可以使用匿名函式（anonymous functions），或是有名字的；你可以使用多种的快捷，好比直接设定 `click` 属性，或使用 `addEventListener`。在我们练习过程中，主要专注在 `addEventLister` 与匿名函式上，它们可能是开发者最常见的网页开发技巧。同时，也是弹性最高的： `addEventListener` 作用在任何事件，任何以参数方式输入的事件名称。

### 常见事件

创造应用时，这边有[数种事件](https://developer.mozilla.org/docs/Web/Events)提供给你监听。基本上，使用者在网页上做的任何行为都会触发事件，你需要花大量时间、大量精力确保它们有相对应的使用者体验。幸运的是，你只需要处理少部分的事件类型。这边是一些常见的事件类型，我们会使用其中两种来建立游戏：

- [点击](https://developer.mozilla.org/docs/Web/API/Element/click_event)： 使用者点击物件，通常会是按钮或是连结。
- [右键选单](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event)： 使用者点击滑鼠右键。
- [选取](https://developer.mozilla.org/docs/Web/API/Element/select_event)： 使用者标记特定文字。
- [输入](https://developer.mozilla.org/docs/Web/API/Element/input_event)： 使用者输入文字。

## 建立游戏

现在我们借由建立游戏，了解事件是如何在 JavaScript 上运作的。我们的游戏会测试玩家的打字技巧，一项程式开发员被忽略的技能之一。我们应该时刻练习打字技术！大致的游戏流程如下：

- 玩家点击「开始」按钮并产生一行要被输入的引文
- 玩家尽快地输入这段文字到文字框中
  - 当单字输入完毕时，立即标记下一个单字。
  - 当玩家打错字时，将文字框转为红色。
  - 当玩家完成引文输入时，显示祝贺语与花费的时间。

让我们开始建立游戏，学习事件驱动吧！

### 档案结构

我们总共需要三个档案：**index.html**、**script.js** 与 **style.css**。我们来设定它们，以完成后续的步骤。

- 建立新的资料夹存放我们的游戏，开启 Console 或是终端机，输入下列指令：

```bash
# Linux 或 macOS
mkdir typing-game && cd typing-game

# Windows
md typing-game && cd typing-game
```

- 打开文字编辑器 Visual Studio Code

```bash
code .
```

- 现在，在 Visual Studio Code 中新增三个档案到资料夹中，分别为：
  - index.html
  - script.js
  - style.css

## 建立使用者介面

借由回顾我们的需求，我们在 HTML 页面上新增一些元素。这就像是看一份食谱，你需要对应的食材：

- 一个地方呈现将被输入的引文
- 一个地方呈现任何讯息，好比祝贺文
- 一个玩家输入的文字框
- 一个开始按钮。

每一个物件都需要 ID ，让 JavaScript 程式能控制它们。另外，在 HTML 档案汇入 CSS 与 JavaScript 档，我们等一下会编辑它们。

在新的 **index.html** 档案中，加入下列程式码：

```html
<!-- inside index.html -->
<html>
<head>
  <title>Typing game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Typing game!</h1>
  <p>Practice your typing skills with a quote from Sherlock Holmes. Click **start** to begin!</p>
  <p id="quote"></p> <!-- This will display our quote -->
  <p id="message"></p> <!-- This will display any status messages -->
  <div>
    <input type="text" aria-label="current word" id="typed-value" /> <!-- The textbox for typing -->
    <button type="button" id="start">Start</button> <!-- To start the game -->
  </div>
  <script src="script.js"></script>
</body>
</html>
```

### 执行应用程式

最好的逐段开发模式是定期的确认程式结果。让我们来执行现在的应用程式。Visual Studio Code 上有一个好用的扩充套件为 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)，它会在你储存网页档案时，同时架设并更新浏览器上的网页。

- 安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)，点击连结中的 **Install**
  - 浏览器要求开启 Visual Studio Code，Visual Studio Code 会执行后续的安装流程
  - 安装完后，重启 Visual Studio Code
- 一旦安装完成，在 Visual Studio Code 下按下 Ctrl-Shift-P (或 Cmd-Shift-P) 开启指令视窗。
- 输入 **Live Server: Open with Live Server**
  - Live Server 会架设并发布你的网页成果
- 开启浏览器，前往 **https://localhost:5500**
- 现在你能看到你所做的网页！

让我们来为网页增加更多功能。

## 加入 CSS

建立完 HTML 档，现在我们为了造型加入 CSS。我们需要标记玩家需要输入的单字，若单字输入错误时需要改变文字框的颜色。利用两组 class 来完成：

在档案 **style.css** 加入下列语法：

```css
/* 在 style.css 中 */
.highlight {
  background-color: yellow;
}

.error {
  background-color: lightcoral;
  border: red;
}
```

✅ 处理 CSS 时，你可以规划任何你想要的介面布局。花点时间让你的网页更迷人：

- 变更其他字型
- 改变标题颜色
- 改变物件大小

## JavaScript

建立完使用者介面后，我们要专注在 JavaScript 上，提供网页逻辑处理的能力。我们将工作分为下列步骤：

- [建立常数](#建立常数)
- [事件监听者 - 开始游戏](#加入开始逻辑)
- [事件监听者 - 输入文字](#加入打字逻辑)

首先，我们先编辑档案 **script.js**。

### 建立常数

加入一些变数给程式使用。同样地，就像食谱一样，我们需要的食材如下：

- 矩阵，储存所有引文
- 空矩阵，储存单一引文的所有单字
- 变数，储存空矩阵的索引，标记玩家现在面对的单字
- 变数，纪录玩家点击开始时的时间

我们也需要将使用者介面上的物件做连结：

- 文字框 (**typed-value**)
- 显示引文 (**quote**)
- 讯息栏 (**message**)

```javascript
// 在档案 script.js 中
// 所有的引文内容
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
// 储存单字列表及目前要输入的单字索引
let words = [];
let wordIndex = 0;
// 开始时间
let startTime = Date.now();
// 网页物件连结
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
```

✅ 试著加入更多的引文到你的游戏中。

> **笔记** 我们可以接收任何物件，只要使用程式码 `document.getElementById`。因为我们需要定期参考这些元素，所以使用常数来确认是否有单字输入错误的问题。框架如 [Vue.js](https://vuejs.org/) 或 [React](https://reactjs.org/) 可以帮助你更好管理你的程式码。

花点时间观看下列关于 `const`、`let` 与 `var` 的影片。

[![变数类型](https://img.youtube.com/vi/JNIXfGiDWM8/0.jpg)](https://youtube.com/watch?v=JNIXfGiDWM8 "变数类型")

> 点击上方图片以观赏关于变数的影片。

### 加入开始逻辑

为了开始我们的游戏，玩家会点击开始按钮。当然，我们不知道何时玩家会开始游戏，这就是为什么我们使用[事件监听者](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)到程式中。一个事件监听者允许我们监看事件的触发与对应的回应程式。在这个例子，我们希望当使用者点击开始时，执行某些程式。

当玩家点击 **start** 按钮后，我们需要挑选一段引文、设定使用者介面并追踪现在玩家的要输入的单字与时间。下列为我们需要新增的程式码，我们会在之后逐行解释。

```javascript
// 在 script.js 末端
document.getElementById('start').addEventListener('click', () => {
  // 取得一行引文
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  // 将引文分成许多单字，存在矩阵中。
  words = quote.split(' ');
  // 重制单字索引来做追踪
  wordIndex = 0;

  // 更新使用者介面
  // 建立 span 元素的矩阵，设定 class 用。
  const spanWords = words.map(function(word) { return `<span>${word} </span>`});
  // 转换成字串并以 innerHTML 显示引文
  quoteElement.innerHTML = spanWords.join('');
  // 标记第一个单字
  quoteElement.childNodes[0].className = 'highlight';
  // 清除讯息栏之前的讯息
  messageElement.innerText = '';

  // 设定文字框
  // 清除文字框
  typedValueElement.value = '';
  // 设定 focus
  typedValueElement.focus();
  // 设定事件驱动程式

  // 开始计时器
  startTime = new Date().getTime();
});
```

我们来分解程式码吧！

- 设定单字追踪
  - 使用 [Math.floor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) 和 [Math.random](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/random) 让我们能随机从矩阵 `quotes` 中挑选一行引文
  - 转换 `quote` 成 `words` 组成的矩阵，追踪目前玩家正在输入的单字
  - `wordIndex` 设定为 0，玩家会从第一的单字开始输入
- 设定使用者介面
  - 建立矩阵 `spanWords`，将每一个单字包在 `span` 元素中
    - 这让我们能高光标记单字
  - `join` 矩阵来建立字串，我们可以在 `quoteElement` 上更新 `innerHTML`
    - 这会显示引文给玩家检视
  - 设定第一个 `span` 元素的 `className` 成 `highlight`，来标记单字呈黄色
  - 修改 `messageElement`的 `innerText` 成 `''`，这会清除讯息栏的内容
- 设定文字框
  - 清除目前 `typedValueElement` 的 `value` 
  - 设定 `typedValueElement` 成 `focus` 
- 呼叫 `getTime` 来启始计时器

### 加入打字逻辑

当玩家开始打字时，`input` 事件会被触发。对应的事件监听者需要检查玩家是否输入正确的单字，监控目前的游戏状况。回到档案 **script.js**，加入下方程式码到档案最下方。我们会在后续解释程式码。

```javascript
// script.js 最末端
typedValueElement.addEventListener('input', () => {
  // 取得目前的单字
  const currentWord = words[wordIndex];
  // 取得目前输入的数值
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // 句子最末端
    // 显示成功
    const elapsedTime = new Date().getTime() - startTime;
    const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
    messageElement.innerText = message;
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    // 单字最末端
    // 清除输入的数值，准备给新的单字使用
    typedValueElement.value = '';
    // 移动到下一个单字
    wordIndex++;
    // 重设所有引文子元素的 class 名称
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    // 标记新单字
    quoteElement.childNodes[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
    // 单字目前输入正确
    // 标记下一个单字
    typedValueElement.className = '';
  } else {
    // 单字输入错误
    typedValueElement.className = 'error';
  }
});
```

让我们分解程式码吧！我们开始取得目前的单字与玩家输入的数值。我们建立一系列的逻辑，检查引文是否输入完成，单字是否输入完成，单字是否正确、是否错误。

- 引文完成，检查 `typedValue` 与 `currentWord` 相等且 `wordIndex` 与 `words` 的 `length` 减一相等。
  - 计算 `elapsedTime` ，利用目前时间减去 `startTime` 取得游戏时长
  - `elapsedTime` 除以 1,000 ，转化毫秒单位为秒单位
  - 显示成功讯息
- 单字完成，以 `typedValue` 间的空白为界，检查 `typedValue` 是否与 `currentWord` 相等
  - 设定 `typedElement` 的 `value` 成 `''` ，准备给下一个单字输入进来
  - 增加 `wordIndex` 到下一个单字
  - 进回圈，每一个 `quoteElement` 的 `childNodes` ，它们的 `className` 都被设为 `''` ，代表预设的单字呈现规则
  - 设定单字的 `className` 成 `highlight` 来标记为下一个被输入的单字
- 单字目前输入正确但未完成，从 `typedValue` 开始检查 `currentWord` 
  - 确保清除 `typedValueElement` 的 `className`，显示预设的呈现方式。
- 若此时输入错误，我们加上错误规则
  - 设定 `typedValueElement` 的 `className` 成 `error`

## 测试你的应用程式

我们做到最后了！最后一步就是确保我们的应用程式运作正常。试试看！不要担心程式出现错误，**所有的开发者**都会面临错误。有需要时，检查程式讯息并侦错。

点击按钮 **start**，马上开始输入单字！你可以看看这预览动画。

![游戏中的动画](../../images/demo.gif)

---

## 🚀 挑战

加入更多功能。

- 在完成游戏时，关闭 `input` 事件监听者；游戏重新开始时，再重新开启它。
- 当玩家完成引文时，关闭文字框
- 以对话窗格的方式显示恭贺讯息
- 利用 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 储存最高分的资料

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/22?loc=zh_tw)

## 复习与自学

在浏览器上阅读[所有开发者可运用的事件](https://developer.mozilla.org/docs/Web/Events)，想想你能在什么样的场合使用各个事件。

## 作业

[建立一款新的键盘游戏](assignment.zh-cn.md)
