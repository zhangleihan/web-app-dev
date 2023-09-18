# 浏览器扩充功能专案 Part 1：关于浏览器

![浏览器绘图笔记](/sketchnotes/browser.jpg)
> 由 [Wassim Chegham](https://dev.to/wassimchegham/ever-wondered-what-happens-when-you-type-in-a-url-in-an-address-bar-in-a-browser-3dob) 绘制

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/23?loc=zh_tw)

### 大纲

浏览器扩充功能新增额外的功能给浏览器。在你建立之前，你应该学习浏览器是如何运作的。

### 关于浏览器

在这一系列的课程中，你会学习如何建立浏览器扩充功能，运作在 Chrome、Firefox 与 Edge 浏览器上。在这一章中，你会探索浏览器是如何运作，建立浏览器扩充功能的内容。

但到底何谓浏览器？它是帮助用户显示伺服器内容到网页上的程式软体。

✅ 小历史：第一个网页浏览器为 'WorldWideWeb'，由 Timothy Berners-Lee 爵士于 1990 年建立。

![早期的浏览器](../images/earlybrowsers.jpg)
> 这边有一些早期的浏览器，请参考[Karen McGrane](https://www.slideshare.net/KMcGrane/week-4-ixd-history-personal-computing)

用户使用网址 URL (Uniform Resource Locator) 位置连上网路，通常以 `http` 或 `https` 位置开头使用超文本传输协定(Hypertext Transfer Protocol)，浏览器便能与该伺服器沟通并抓取网页的资料。

这时，浏览器转译引擎会呈现到用户的装置上，可以是手机、桌机或是笔记型电脑。

浏览器也有能力暂存内容，不需要每一次都向伺服器请求内容。浏览器储存用户的浏览纪录、储存 'cookies'，一种包含用户活动资讯的小型资料。

请记得一件重要的事，各家浏览器并不会相同！每一种浏览器都有各自的长处短处，专业的网页开发人员必须了解如何让网页在不同浏览器上运作正常。这包含处理手机的小视窗，处理离线用户的行为。

这边有一个值得加到你书籤的实用网页：[caniuse.com](https://www.caniuse.com)。当你在建构网页时，你可以查询 caniuse 技术支援清单，确保你能提供用户最佳的使用体验。

✅ 你知道你的网页用户最常使用什么浏览器吗？检查你的分析程式，你可以安装各种分析程式当作是你开发的一种环节，它们会告诉你那些浏览器最常被使用。

## 浏览器扩充功能

为什么你需要建立浏览器扩充功能？它能附加在浏览器上，让你快速地重复执行部分功能。举例来说，如果你需要在网页中检查你所互动的颜色，你或许需要颜色选择器扩充功能；如果你有记忆帐号密码的困扰，你可能需要密码管理扩充功能。

浏览器扩充功能在开发上也很有趣。它们有效地管理并执行少部分任务课题。

✅ 你最喜欢哪一项浏览器扩充功能？它们提供了什么功能？

### 安装扩充功能

在你建立扩充功能以前，先看看建制与安装浏览器扩充功能的流程。每一种浏览器在管理套件上可能有些不同，Edge上的管理过程就与 Chrome 与 Firefox 相似：

![Edge 浏览器开启 edge://extensions 中的设定选单截图](../images/install-on-edge.png)

大体而言，过程为：

- 指令 `npm run build` 建制你的管理套件
- 在浏览器中的延伸模组区点击右上方的「更多设定」按钮
- 如果这是新的套件，选择 `load unpacked` 从资料夹上传新的扩充套件(在我们的例子中， `/dist` ) 
- 如果这是已安装的套件，点击 `reload` 按钮

✅ 上述教学步骤让你导入自己建立的扩充功能；若要安装已公开的套件，你可以前往浏览器扩充功能商店，逛逛这些[商店](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home)并安装你选择的套件。

### 展开行动

你打算写一套扩充功能来显示你国家的碳足迹，显示国家的能源使用量与可用能源量。套件内会有 API Key 来存取网页 CO2 Signal 的 API。

**你需要：**

- [一组 API key](https://www.co2signal.com/)：在网页上输入你的电子信箱，它会寄一组钥匙给你
- 给[Electricity Map](https://www.electricitymap.org/map)使用的[国家区域代码](http://api.electricitymap.org/v3/zones) (举个例子，在波士顿使用'US-NEISO')
- [程式码](../../start)，下载 `start` 资料夹，你需要修改里面的程式码档案。
- [NPM](https://www.npmjs.com)，NPM 是一套软体包管理工具，在本地安装的软体包会被列在 `package.json` 档案中，成为网页利用的资源。

✅ 从[这个优质的学习套件](https://docs.microsoft.com/learn/modules/create-nodejs-project-dependencies/?WT.mc_id=academic-77807-sagibbon)中，学习更多关于软体包管理。

花点时间看一下程式档案结构

dist
    -|manifest.json (defaults set)
    -|index.html (前端 HTML)
    -|background.js (background JS)
    -|main.js (built JS)
src
    -|index.js (你的 JS 程式码)

✅ 当你取得你的 API Key 与国家区域代码后，纪录在笔记中给之后的课程使用。

### 建立给扩充功能使用的 HTML

这套扩充功能有两个重点。一个是取得 API Key 与国家区域代码：

![在浏览器扩充功能中，显示 API key与国家区域代码的输入栏截图](../images/1.png)

与显示国家的碳排放量：

![在浏览器扩充功能中，显示 US-NEISO 地区碳排放量与石化燃料比例截图](../images/2.png)

让我们开始建立输入栏位的 HTML 与它的 CSS 吧。

在资料夹 `/dist` 中，建立输入表单与结果显示区域。在档案 `index.html` 中，规划表单区域：

```HTML
<form class="form-data" autocomplete="on">
	<div>
		<h2>New? Add your Information</h2>
	</div>
	<div>
		<label for="region">Region Name</label>
		<input type="text" id="region" required class="region-name" />
	</div>
	<div>
		<label for="api">Your API Key from tmrow</label>
		<input type="text" id="api" required class="api-key" />
	</div>
	<button class="search-btn">Submit</button>
</form>	
```
这个表单储存你的输入资讯并储存到 Local Storage 中。

接下来，建立结果输出区。在 form tag 后面新增一些 divs：

```HTML
<div class="result">
	<div class="loading">loading...</div>
	<div class="errors"></div>
	<div class="data"></div>
	<div class="result-container">
		<p><strong>Region: </strong><span class="my-region"></span></p>
		<p><strong>Carbon Usage: </strong><span class="carbon-usage"></span></p>
		<p><strong>Fossil Fuel Percentage: </strong><span class="fossil-fuel"></span></p>
	</div>
	<button class="clear-btn">Change region</button>
</div>
```
这时，你可以试著建制这个专案。请确保安装扩充套建的软体依赖套件，输入：

```
npm install
```

这项指令会使用 NPM (Node Package Manager)安装 webpack 给你的扩充套件建制过程中使用。Webpack 是一个处理程式编译的工具组合包。你可以在 `/dist/main.js` 看到它的执行后的结果 ── 程式码已经被打好包了。

到目前为止，扩充套件已经被建制，如果你导入此套件到 Edge 中也能完整地呈现出来。

恭喜你，你已经达成建立扩充套件的第一步骤。在接下来的课程中，你会新增更多功能，让它更加的实用。

---

## 🚀 挑战

逛逛浏览器扩充商店，安装一套扩充功能到你的浏览器中。你可以查看它的档案群。你发现了什么？

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/24?loc=zh_tw)

## 复习与自学

这堂课中你学到了一些浏览器的历史。趁这个机会阅读更多它的历史，学习网际网路的发明者是如何构思网路的应用。这边有一些实用的网页：

[浏览器的历史](https://www.mozilla.org/firefox/browsers/browser-history/)

[网路的历史](https://webfoundation.org/about/vision/history-of-the-web/)

[与 Tim Berners-Lee 的访谈](https://www.theguardian.com/technology/2019/mar/12/tim-berners-lee-on-30-years-of-the-web-if-we-dream-a-little-we-can-get-the-web-we-want)

## 作业

[重新造型你的套件](assignment.zh-cn.md)

