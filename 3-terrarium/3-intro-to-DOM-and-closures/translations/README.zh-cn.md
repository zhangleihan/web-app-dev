# 盆栽盒专案 Part 3 - DOM 元素控制与闭包

![DOM 元素与闭包](../../sketchnotes/webdev101-js.png)
> 由 [Tomomi Imura](https://twitter.com/girlie_mac) 绘制

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/19?loc=zh_tw)

### 大纲

操作 DOM (Document Object Model) 是网页开发的一项关键。根据 [MDN 文件](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)， 「Document Object Model (DOM) 元素能根据网页文件的结构与内容来呈现物件」。借由使用 JavaScript 框架而非原始的 JavaScript 程式码来管理 DOM，在网页上操作 DOM 的挑战已经不比以前困难了，但这里我们要自己来管理它们！

此外，这堂课也会介绍有关[JavaScript 闭包(Closure)](https://developer.mozilla.org/docs/Web/JavaScript/Closures)的概念，你可以想像成一个函式被包在另一个函式中，以访问外面函式范围中的变数。

> JavaScript 闭包是个广阔且复杂的主题。本堂课只触及建立盆栽盒需要的最基础概念。你能得知一个闭包为：内部函式和外部函式建立一项关系，允许内部函式存取外部函式的变数等作用域。要得知更多关于闭包的原理，请造访观看[额外的文件](https://developer.mozilla.org/docs/Web/JavaScript/Closures)。

我们会使用闭包来操控 DOM。

想像 DOM 就像一棵树，表现出所有操作网页的方式。多样的 APIs (Application Program Interfaces) 提供程式开发者，依照自己使用的程式语言，以存取、编辑、编排等方式管理 DOM 元素。

![DOM 树的表达](./images/dom-tree.png)

> HTML 语法会参考 DOM 的呈现方式。出自 [Olfa Nasraoui](https://www.researchgate.net/publication/221417012_Profile-Based_Focused_Crawler_for_Social_Media-Sharing_Websites)。

在这堂课中，我们会完成我们的盆栽盒专案，建立 JavaScript 来对网页中的植物进行互动式操作。

### 开始之前

确保盆栽盒的 HTML 与 CSS 已经编辑完成。这堂课会新增拖曳植物进出盆栽罐的功能。

### 课题

在专案资料夹中，新增档案 `script.js`。 汇入该档案在 HTML 档 `<head>` 的部分：

```html
	<script src="./script.js" defer></script>
```

> 笔记：汇入外部 JavaScript 档案到 HTML 档案须使用 `defer`，让 JavaScript 档案只有在 HTML 被完全载入时才被执行。你也可以使用 `async` 的属性，允许 JavaScript 在解析 HTML 档时就被执行。这项专案中，我们必须确保 HTML 的元件被完整建立后才允许使用拖曳功能。
---

## DOM 元素

我们要做的第一件事是建立 DOM 下，要被操控的物件的连结。在专案例子中，我们有罐子外的十四株植物等著被拖曳。

### 课题

```html
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));
```

发生了什么事？你正以 DOM 搜寻网页档内的物件，借由 Id 作为依据来搜寻。回想第一堂 HTML 课中，我们可每一株植物一个专属的 Id (`id="plant1"`)，现在你就可以使用它。在辨别完每一株植物物件后，传递给待编辑的函式 `dragElement`，让 HTML 物件可以被拖曳。

✅ 为什么我们要以 Id 作为物件的参考？为什么不以 CSS 的 class 作为参考？请参考以前的 CSS 课程回答此问题。

---

## 闭包(Closure)

现在，你已经准备好要建立 dragElement 闭包，建立包在外部函式内的内部函式组，在我们的例子中，会用上三个函式。 

闭包在一或多个以上函式要存取外部函式时非常好用。看看下面的例子：

```javascript
function displayCandy(){
	let candy = ['jellybeans'];
	function addCandy(candyType) {
		candy.push(candyType)
	}
	addCandy('gumdrops');
}
displayCandy();
console.log(candy)
```

这项例子中，函式 displayCandy 包住另一个函式 addCandy，新增新的糖果样式到已存在的矩阵当中。当执行这段程式时，矩阵 `candy` 会被认作是未定义，因为它是函式的本地变数。 

✅ 你能让矩阵 `candy` 被存取吗？试著将它移到闭包外面。这时，矩阵会变成全域变数，取消闭包内的存取限制。

### 课题

在档案 `script.js` 的元素宣告下方，新增函式：

```javascript
function dragElement(terrariumElement) {
	//set 4 positions for positioning on the screen
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	terrariumElement.onpointerdown = pointerDrag;
}
```

`dragElement` 借由程式定义的参数取得 `terrariumElement` 物件。之后，设定一些位置 `0` 的变数给函式内的物件使用。它们是本地变数，给每一个进到拖曳函式内的物件操控。盆栽盒会被这些拖曳物件填充，我们的网页应用必须要持续追踪这些物件的位置。

此外，进到函式的 terrariumElement 也被新增了 `pointerdown` 事件，它是管理 DOM 的其中一项[网页 APIs](https://developer.mozilla.org/docs/Web/API)。当按钮按下时，或是在我们案例中，一个拖曳物件被点击时，`onpointerdown` 事件就会被触发。这个事件处理器(event handler)皆运作在[网页与行动浏览器](https://caniuse.com/?search=onpointerdown)上，只有少部分的例外。

✅ [事件处理器 `onclick`](https://developer.mozilla.org/docs/Web/API/GlobalEventHandlers/onclick)支援更多的浏览器。为什么我们不在这边使用它？ 想想看我们在这此建立的视窗互动类型。

---

## 函式 pointerDrag

terrariumElement 已经准备好被拖曳了。当触发 `onpointerdown` 事件时，函式 pointerDrag 会参与其中。新增这项函式在程式码 `terrariumElement.onpointerdown = pointerDrag;` 下方：

### 课题

```javascript
function pointerDrag(e) {
	e.preventDefault();
	console.log(e);
	pos3 = e.clientX;
	pos4 = e.clientY;
}
```

许多事情会发生。首先，你使用 `e.preventDefault();` 取消掉 pointerdown 原先的预设事件。这样你可以操作更多的介面行为。

> 回到你建立的程式码中，试著删除 `e.preventDefault()` 并执行看看，发生了什么事？

第二，用浏览器打开 `index.html` 并调查我们的介面。当你点击植物时，你可以发现 'e' 事件被触发了。专研一下，一个 pointerdown 事件会产生多少资讯！  

接下来，纪录本地变数 `pos3` 和 `pos4` 被设定为 e.clientX 和 e.clientY。你可以在观察面板中，会发现 `e` 的数值。这项数值取得按下植物瞬间的 x 与 y 座标资讯。为了全面的控制植物行为，在拖曳植物时，我们会持续更新座标资讯。

✅ 将整个网页应用建立在一个大闭包下，会让程式码变得比较清楚吗？如果没有，你有其他方法管理这十四株可拖曳的植物吗？

增加初始化函式，在程式码 `pos4 = e.clientY` 下方加上下列两行事件处理：

```html
document.onpointermove = elementDrag;
document.onpointerup = stopElementDrag;
```

现在，在游标拖曳时，你的植物能跟著你的游标走，而在你取消点击时停下来。`onpointermove` 和 `onpointerup` 也是 `onpointerdown` 类型相同的 API。然而，现在介面会出现错误讯息，因为我们还没建立函式 `elementDrag` 与 `stopElementDrag`。

## 函式 elementDrag 与 stopElementDrag

新增两条内部函式在闭包中，它们会处理拖曳植物与停止拖曳的事件。你希望你可以拖曳任何一株植物且放在萤幕上的任一地方。介面并没有强制你盆栽盒的配置格式，你可以自由地增加、移除与移动盆栽罐内的植物。

### 课题

新增函式 `elementDrag` 在函式闭包 `pointerDrag` 宣告列的正下方：

```javascript
function elementDrag(e) {
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	console.log(pos1, pos2, pos3, pos4);
	terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
	terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
}
```

在这条函式之前，你编辑了四个本地变数位置的初始值在外部函式中。这边又做了什么事？

当你拖曳物件时，你更新数值 `pos1` 为 `pos3` 减去现在的 `e.clientX`，而 `pos3` 在之前被初始化为为 `e.clientX`。同样的行为套用在 `pos2`上。之后，你更新 `pos3` 与 `pos4` 到新的 XY 座标点位置。你能在 console 下看到数值在拖曳下更新的情况。我们也更新植物的 CSS 造型中的定位点为 `pos1` 与 `pos2`，比较植物左上方座标点与新座标点的关系。

> `offsetTop` 和 `offsetLeft` 是 CSS 的属性，决定物件与它父关系物件的定位关系。父关系物件可以是任何元素，只要它的定位属性不为 `static`。

这些座标点的计算式让你成功校整了植物与盆栽盒之间的行为。

### 课题

最后的课题是在介面上新增 `stopElementDrag` 函式，我们将它加在函式闭包 `elementDrag` 的正下方：

```javascript
function stopElementDrag() {
	document.onpointerup = null;
	document.onpointermove = null;
}
```

这条小函式重制 `onpointerup` 与 `onpointermove` 事件，这样你可以重新开始该植物的拖曳事件，或是拖曳新的植物。

✅ 如果不将这些事件设为空值时，会发生什么事？

我们终于完成了这项专案！

🥇 恭喜你！你建立了一个漂亮的盆栽盒。![盆栽盒成果图](../images/terrarium-final.png)

---

## 🚀 挑战

新增新的事件处理器到你的闭包中，让你能对植物做更多的事情。举例来说，双击植物让它排列到最上层。发挥你的创意吧！

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/20?loc=zh_tw)

## 复习与自学

在萤幕上拖曳物件看似简单，但依照不同的目的与实现方法会遭遇到不同的问题。事实上，这边有一份关于你可以尝试的[拖曳 API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)。我们没在专案中使用是为了建立不一样的实现方法，试著使用这些 API 到专案中，看看你能完成什么。

在 [W3C 文件](https://www.w3.org/TR/pointerevents1/) 和 [MDN 网页文件](https://developer.mozilla.org/docs/Web/API/Pointer_events)上取得更多关于 pointer 的事件。

记得习惯性用 [CanIUse.com](https://caniuse.com/) 检查网页的浏览器兼容性。

## 作业

[用 DOM 做更多事](assignment.zh-cn.md)

