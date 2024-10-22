# 浏览器扩展插件 Part 1：学习背景工作与效能

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/27?loc=zh_tw)

### 大纲

在前两堂课程中，你学会如何建立表单、在结果区块中显示 API 回复的资料，这是网页处理信息的标准流程。也掌握了如何异步地抓取资料，这项扩展插件已经接近完成了。

目前只剩下管理背景工作：包括刷新插件的图示颜色。接下来，我们学习浏览器是如何处理这类的工作，也让我们分析网页的数据处理逻辑以及浏览器会多有效地处理其中的内容。

## 网页处理效能的基础

> "网页处理效能关乎两件事：网页多快地载入，与程序多快地执行。" -- [Zack Grossbart](https://www.smashingmagazine.com/2012/06/javascript-profiling-chrome-developer-tools/)

关于如何让你的网页能快速地运作在各类终端设备、各个使用者以及各种情况，是一件难以想像的庞大主题。这里有一些要点确保你在开发网页或是扩展插件时，铭记在心。

第一件事，为确保网页收集关于网页效能的资料，在浏览器的开发者工具中可以实现它。在 Chrome和Edge 中，选择「设定及更多」按钮(浏览器上三个点的图示)，并选择更多工具 > 开发人员工具并开启 Performance 分页。你也可以使用键盘快捷键，Windows 上的 `Ctrl` + `Shift` + `I` 与 Mac 上的 `Option` + `Command` + `I` 来开启开发人员工具。

Performance 分页包括了效能分析工具。开启一个网页，例如 https://www.bupt.edu.cn ，点击 'Record' 按钮并重新整理网页。停止录制后你就能取得网页的 'script'、'render' 与 'paint' 的过程与资讯：

![Edge 性能分析工具](./images/profiler.png)

✅ 访问 [Microsoft 文件](https://docs.microsoft.com/microsoft-edge/devtools-guide/performance/?WT.mc_id=academic-77807-sagibbon)观看 Edge 的 Performance 分页信息

> 提示：要取得真正的网页开启时间，记得清除你的浏览器缓存。

选择网页在载入时时间列中出现的内容。

观看它的总览面板并截图记录网页效能。

![Edge 性能分析工具截图](./images/snapshot.png)

检查 Event Log 面板，是否有网页事件花超过 15 毫秒：

![Edge event log](./images/log.png)

✅ 了解性能分析工具！在这个网页中，开启开发者工具，检查是否有任何瓶颈。什么是载入最久的组件？哪个又是最快的？

## 效能分析

总体而言，每一位网页开发者一定要注意一些「有问题的地方」，避免在发布作品时有令人意想不到的惊喜。

**资产(Asset)大小**：过去几年来，网页「变重」了，也因此变慢了。有些负担来自于图片的使用。

✅ 查询 [Internet Archive](https://httparchive.org/reports/page-weight)，看看过去的网页负载等信息。

一个好的习惯是确保你的图片有做优化，呈现合理的档案大小及分辨率影像给你的使用者。

**DOM 查找元素(Traversal)**：浏览器必须依照你的程序建立 Document Object Model，请确保你的 tags 最小化，网页只使用必须的功能与风格。另外，过量的网页 CSS 也可以被优化，举例来说，造型样板只用在单页上，而非全域上。

**JavaScript**：每一位 JavaScript 开发者都需要会观察 'render-blocking' 脚本，它会在 DOM 查找与浏览器呈现前被载入好。请考虑使用 `defer` 在你的程序中，我们的盆栽盒专案就有练习这个用法。

✅ 在[网页测速网](https://www.webpagetest.org/)上测试一些网页，学习确认网页效能的基本检查。

现在你了解浏览器如何呈现你所提供的信息资产，我们来看看我们的扩展插件最后需要补齐的项目：

### 建立函数计算对应的颜色

编辑 `/src/index.js`，新增函数 `calculateColor()` 在一系列为了 DOM 存取的 `const` 变数之后：

```JavaScript
function calculateColor(value) {
	let co2Scale = [0, 150, 600, 750, 800];
	let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

	let closestNum = co2Scale.sort((a, b) => {
		return Math.abs(a - value) - Math.abs(b - value);
	})[0];
	console.log(value + ' is closest to ' + closestNum);
	let num = (element) => element > closestNum;
	let scaleIndex = co2Scale.findIndex(num);

	let closestColor = colors[scaleIndex];
	console.log(scaleIndex, closestColor);

	chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
}
```

发生了什么事？你传递了 API 返回的二氧化碳浓度数值，计算出它最适合对应的颜色矩阵索引位置。之后，你将这个颜色数值传给了 chrome runtime。

chrome.runtime 有[一个 API](https://developer.chrome.com/extensions/runtime)处理所有的背景工作，你的扩展插件借助了此功能：

> "在应用程式中，使用 chrome.runtime API 来接收背景页面，回传关于 manifest 的信息，监听并回应事件。你也可以利用此 API 转换 URL 的相对路径成绝对路径。"

✅ 如果你正打算开发这个插件给 Edge 浏览器上使用，你可能会惊讶地发现你使用的是 chrome API。新的 Edge 浏览器执行在 Chromium browser 引擎上，所以你也能使用这些工具。

> 注意，如果你想要分析浏览器扩充功能，请在扩充插件上执行开发者工具，它与浏览器主视窗是不同的个体。

### 设定图示预设颜色

现在，在函式 `init()` 中，调用 chrome `updateIcon` 设定图示颜色为通用绿：

```JavaScript
chrome.runtime.sendMessage({
	action: 'updateIcon',
		value: {
			color: 'green',
		},
});
```
### 调用函数、执行请求

接下来，在 C02Signal API 回传的 promise 物件下方调用函数：

```JavaScript
//let CO2...
calculateColor(CO2);
```
最后，在代码 `/dist/background.js` 中，新增事件监听者给这些背景行为的调用：

```JavaScript
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action === 'updateIcon') {
		chrome.browserAction.setIcon({ imageData: drawIcon(msg.value) });
	}
});
//参考 energy lollipop extension，很好的程式！
function drawIcon(value) {
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');

	context.beginPath();
	context.fillStyle = value.color;
	context.arc(100, 100, 50, 0, 2 * Math.PI);
	context.fill();

	return context.getImageData(50, 50, 100, 100);
}
```
在此程序中，你建立了事件监听者给所有的背景管理组件。例如，'updateIcon' 被调用，则接下来的程序会被执行，利用 Canvas API 绘制出对应颜色的图示。

✅ 你会学习更多关于 Canvas API 在往后的[太空游戏课程](../../../6-space-game/2-drawing-to-canvas/translations/README.zh-tw.md)。

现在，重新编译你的扩充功能(`npm run build`)，刷新并运行你的套件，观察图示的颜色变化。

恭喜你，你已经建立了一款实用的浏览器扩展插件，并学到更多浏览器的运作方式与监测它的效能分析。

---

<!-- ## 🚀 挑战

调查一些悠久的开源网站，并根据它们的 GitHub 历史，你能分辨它们过去几年以来效能上的调整吗？什么它们是共同的痛点？ -->

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/28?loc=zh_tw)

## 复习与自学

请考虑注册[performance newsletter](https://perf.email/)

调查浏览器测量网页效能的方法，查看开发者工具内的 Performance 分页。你能找到什么巨大的差别吗？

## 作业

[完成一款浏览器插件](./assignment.zh-cn.md)

