# 盆栽盒专案 Part 2： CSS 简介

![CSS 简介](../../sketchnotes/webdev101-css.png)
> 由 [Tomomi Imura](https://twitter.com/girlie_mac) 绘制

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/17?loc=zh_tw)

### 大纲

阶层式样式表，CSS (Cascading Style Sheets)解决了网页开发重要的问题：如何让网页变得漂亮。为你的应用造型化可以让网页更好用、更好看。你也可以使用 CSS 建立回应式网页设计(Responsive Web Design - RWD)，依据你的视窗大小改变网页的呈现方式。 CSS 不只让网页变美丽，它允许加入动画以呈现更生动的互动体验。CSS 工作组持续维护 CSS 的规格书，你可以在[全球资讯网协会官网](https://www.w3.org/Style/CSS/members)追踪他们的作业。

> 笔记，CSS 是一种程式语言，但就像任何在网路上的东西一样，并不是所有浏览器都支援最新的规格。请时常利用 [CanIUse.com](https://caniuse.com) 检查你的设计是否支援相关浏览器。

这堂课中，我们会为我们的线上盆栽盒增加造型，学习更多 CSS 的概念：串接(Cascade)、继承(Inheritance)、选择器(Selectors)、定位(Positioning)与建立布局(Layout)。我们会规划盆栽盒的布局，建立实际的盆栽盒。

### 开始之前

你需要确保你有盆栽盒的 HTML 程式码，准备被造型化。

### 课题

在盆栽盒专案中，我们新增档案 `style.css`。 在 HTML 档案中汇入该档案在 `<head>` 区块中：

```html
<link rel="stylesheet" href="./style.css" />
```

---

## 串接(Cascade)

串接造型表单体现了造型依照表单上的优先度「串接」在网页应用上。网页作者利用程式码设定造型优先度，行内样式(inline styles)的优先度会比外部造型表单来的高。

### 课题

新增行内造型 "color: red" 到 `<h1>` 标籤中：

```HTML
<h1 style="color: red">My Terrarium</h1>
```

之后，也新增下列程式码在 `style.css` 档案中：

```CSS
h1 {
 color: blue;
}
```

✅ 你的网页显示了哪一种颜色？为什么？你能找到方法覆盖这个造型吗？何时会让你想用这套做法呢？又为什么不呢？

---

## 继承(Inheritance)

从父关系标籤到子关系标籤上继承造型，如被嵌套的物件会继承容器物件的造型。

### 课题

我们设定 body 的字体为特定字型，确认嵌套物件的字型：

```CSS
body {
	font-family: helvetica, arial, sans-serif;
}
```

开启你的浏览器命令栏到 'Elements' 标籤中，观察 H1 的字型。它继承了 body 的字型，表现在浏览器上：

![inherited font](./images/1.png)

✅ 你能让被嵌套元素继承其他格式吗？

---

## CSS 选择器(Selectors)

### 标籤

到目前为止，你的 `style.css` 档案只有一部份标籤被造型化，这让程式看起来很怪：

```CSS
body {
	font-family: helvetica, arial, sans-serif;
}

h1 {
	color: #3a241d;
	text-align: center;
}
```

这种造型方法只能控制被指定的元素，但如果你需要套用在每一种盆栽盒内的植物。你需要利用 CSS 选择器。

### Ids

新增左容器与右容器造型布局。因为网页内只有一个左容器与右容器，我们就这样命名 id 标记。要造型化它们，使用 `#`：

```CSS
#left-container {
	background-color: #eee;
	width: 15%;
	left: 0px;
	top: 0px;
	position: absolute;
	height: 100%;
	padding: 10px;
}

#right-container {
	background-color: #eee;
	width: 15%;
	right: 0px;
	top: 0px;
	position: absolute;
	height: 100%;
	padding: 10px;
}
```

这里，你已经将容器摆在绝对位置上了，一个位在左侧，一个位在右侧。容器宽度使用百分比以确保它们在小萤幕装置上也能运作正常。

✅ 这两段样式已经重复了，请不要照抄。你能找到更好的方式来造型化这些 ids 吗？ 或许你可以从 id 或 class 来下手。让 CSS 套用在容器上，我们需要改写 HTML 程式码：

```html
<div id="left-container" class="container"></div>
```

### Classes

在上述例子中，你成功地为两样物件新增造型。如果你想一次套用在多样物件上，你就需要 CSS classes。利用这个方法来布局两个容器。

注意每个植物的标记都有 ids 与 classes。JavaScript 使用 Id 标记来控制植物的摆放； class 则是被 CSS 套用特定的造型。

```html
<div class="plant-holder">
	<img class="plant" alt="plant" id="plant1" src="./images/plant1.png" />
</div>
```

新增下列程式码到 `style.css` 档案中：

```CSS
.plant-holder {
	position: relative;
	height: 13%;
	left: -10px;
}

.plant {
	position: absolute;
	max-width: 150%;
	max-height: 150%;
	z-index: 2;
}
```

片段开头是 CSS 的定位属性，分为相对与绝对定位，我们会在下一个段落进行解述。我们来看看百分比高度的方式：

你设定了植物架高度为 13%，确保所有植物都能在不需要滚动容器的情况下，在每一个垂直的容器中显示出来。

你设定了植物架向左移 10 像素，让植物能在容器的正中间。图片上亦有大区域的透明区域需要被拖曳过来，往左位移更适合呈现在画面上。

之后，植物设定宽度为 150%。 当浏览器调整比例时，也能同时将植物图片作大小的调整。试著改变浏览器检视比例，植物依旧会保持在容器中。

我们换看 z-index，控制物件的相对高度，让植物坐落在容器上方且在盆栽盒内部。

✅ 为什么需要分为植物架与植物 CSS 选择器？

## 定位(Positioning)

多样的定位属性，包含静态(static)、相对(relative)、固定(fixed)、绝对(absolute)和黏贴(sticky)，有时候让人难以驾驭，但成功设定完后，可以让你完整地掌握元素坐落的位置。

绝对定位元素会依照他的父关系物件来决定定位位置，若没有关系物件，整个文件的 body 就会成为定位依据。

相对定位元素则依照 CSS 指定的方向来调整他的起始位置。

在我们的样本中，`plant-holder` 是相对定位元素，坐落在绝对定位的容器当中。因此，容器被定义在左侧与右侧，而被嵌入的植物架会调整它在容器的位置，保持植物之间的间隔。

> `plant` 本身也拥有绝对定位，为了让图片被拖曳，你能在下段课程中发现更多资讯。

✅ 试著改变容器与植物架的定位模式。发生了什么事？

## 布局(Layouts)

现在，你已经善用你所学的，只用 CSS 建出盆栽盒！

首先，对 `.terrarium` 的 div 子关系物件加上圆边矩形：

```CSS
.jar-walls {
	height: 80%;
	width: 60%;
	background: #d1e1df;
	border-radius: 10%;
	position: absolute;
	bottom: 0.5%;
	left: 20%;
	opacity: 0.5;
	z-index: 1;
}

.jar-top {
	width: 50%;
	height: 5%;
	background: #d1e1df;
	position: absolute;
	bottom: 80.5%;
	left: 25%;
	opacity: 0.7;
	z-index: 1;
}

.jar-bottom {
	width: 50%;
	height: 1%;
	background: #d1e1df;
	position: absolute;
	bottom: 0%;
	left: 25%;
	opacity: 0.7;
}

.dirt {
	width: 58%;
	height: 5%;
	background: #3a241d;
	position: absolute;
	border-radius: 0 0 4rem 4rem;
	bottom: 1%;
	left: 21%;
	opacity: 0.7;
	z-index: -1;
}
```

注意这边百分比的用法，即使是 `border-radius` 也请留意。 当浏览器调整检视比例时，你会发现玻璃罐也会受到调整。 其他值得注意的地方为：玻璃罐的宽度与高度百分比，每个元素绝对定位在中心与视窗的下方。

✅ 试著改变罐子的颜色与透明度，观察泥土与罐子的关系。发生了什么事？为什么？

---

## 🚀 挑战

新增「气泡反光」在罐子左下方的位置，让玻璃材质更拟真一些。你需要编辑 `.jar-glossy-long` 与 `.jar-glossy-short` 造型集来模拟罐子反光。下面是成果图：

![盆栽盒成果图](./images/terrarium-final.png)

在做课后测验前，请先前往下列的学习页面：[用 CSS 造型化你的网页应用](https://docs.microsoft.com/learn/modules/build-simple-website/4-css-basics/?WT.mc_id=academic-77807-sagibbon)

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/18?loc=zh_tw)

## 复习与自学

CSS 看似很好上手，但要在所有浏览器与萤幕大小上运作正常，也会面临到许多挑战。CSS-Grid 与 Flexbox 这两种工具让上述作业变得比较好规划与调整。借由游玩 [Flexbox Froggy](https://flexboxfroggy.com/) 与 [Grid Garden](https://codepip.com/games/grid-garden/) 来学习它们。

## 作业

[重构 CSS](assignment.zh-cn.md)
