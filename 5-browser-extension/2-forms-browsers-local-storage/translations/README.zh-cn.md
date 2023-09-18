# 浏览器扩充功能专案 Part 1：呼叫 API，使用 Local Storage

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/25?loc=zh_tw)

### 大纲

在这堂课中，借由传递你的扩充功能表单并显示结果来呼叫 API。此外，你会了解如何储存资料到浏览器的 Local Storage 中给未来使用。

✅ 请参考下列程式码段，加入程式码到档案适当的位置

### 设定控制扩充功能的元素：

现在你有已建好的 HTML 表单与结果区 `<div>`。接下来，你需要在 `/src/index.js` 做一些处理，一点一点地构筑出你的扩充功能。参考[前一堂课程](../../1-about-browsers/translations/README.zh-tw.md)来设置你的专案与了解建制过程。

处理 `index.js` 档案，建立一些 `const` 变数来储存不同用途的数值：

```JavaScript
// 表单区域
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// 结果区域
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');
```

这些区域会被 CSS class 给参考，它们在前一堂课中已经被你设定好了。

### 新增监听者

接下来，新增提交与重置表单的事件监听者与按钮，让使用者能提交表单或是点击重置钮时，事件会发生。新增初始化呼叫处理到应用中，在档案的最下方新增：

```JavaScript
form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();
```

✅ 注意提交事件与点击事件的写法，事件是如何被传入到 handleSubmit 或是 reset 函式中的。你能在不改变功能的情况下，改写成较长的格式吗？你比较喜欢哪一种写法？

### 建立 init() 函式与 reset() 函式：

现在你需要建立函式 init()，处理应用程式的初始化部分：

```JavaScript
function init() {
	//如果任何东西存在 localStorage 中，取出来
	const storedApiKey = localStorage.getItem('apiKey');
	const storedRegion = localStorage.getItem('regionName');

	//设定 icon 为通用绿色
	//todo

	if (storedApiKey === null || storedRegion === null) {
		//如果没有 keys，显示表单
		form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
	} else {
        //localStorage 有 saved keys/regions，显示结果
        displayCarbonUsage(storedApiKey, storedRegion);
		results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
	}
};

function reset(e) {
	e.preventDefault();
	//只清除 local storage 国家区域代码
	localStorage.removeItem('regionName');
	init();
}

```
在函式中，有一些有趣的逻辑。阅读它们，你看出发生什么事吗？

- 两个 `const` 被设定为检查用户是否有储存 APIKey 与国家区域代码在 local storage 中。
- 若两者皆为 null，将造型设为 'block' 来显示表单
- 隐藏 results、loading 与 clearBtn，设定 error 文字为空字串
- 若存在 key 与代码，开始新的流程：
  - 呼叫 API 取得碳排放资讯
  - 隐藏结果区域
  - 隐藏表单
  - 显示重置按钮

在下一步之前，你可以学习一些浏览器的重要成员：[LocalStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)。 LocalStorage 是浏览器储存字串的有效方法，以 `key-value` 配对两两一组。这种储存型态可以被 JavaScript 管理并控制浏览器的资料。LocalStorage 没有期限，而另一款网页储存 SessionStorage 会在浏览器关闭时清除内容。不同的储存方式有各自的优缺点。

> 注意 ── 你的浏览器扩充套件有自己的 local storage。主浏览器视窗是不同的个体，两者会做各自的行为。

你设定 APIKey 纪录字串数值。你可以在 Edge 浏览器上「检查」一个网页 (右键浏览器来检查)，在 Applications 标籤中观察储存区的使用情况。

![Local storage 区域](../images/localstorage.png)

✅ 想想那些情况你不需要储存资料到 LocalStorage 中。总体而言，将 API Keys 放在 LocalStorage 是个很糟糕的想法！你知道为什么吗？在我们的例子中，我们的应用程式是以教学为目的，并不会发布在应用程式商店中，所以我们选择此中处理方式。

你可以发现网页 API 能处理 LocalStorage，使用 `getItem()`、`setItem()` 或是 `removeItem()`。它们广泛地支援不同的浏览器。

在建立函式 `init()` 中的函式 `displayCarbonUsage()` 之前，我们先建立表单提交初始化的功能。

### 处理表单提交

建立函式 `handleSubmit`，接收事件参数 `(e)`。终止网页移转的事件(在本例子中，我们终止浏览器刷新的处理)并呼叫新的函式 `setUpUser`，传送参数 `apiKey.value` 与 `region.value`。借由这个方式，你能将两个初始表单的数值正确地移转到适合的位置。

```JavaScript
function handleSubmit(e) {
	e.preventDefault();
	setUpUser(apiKey.value, region.value);
}
```
✅ 刷新你的记忆 ── 上堂课中的 HTML 档案开头有两个输入区域，它们的 `values` 被存到 `const` 中，并且被定为 `required`，表示浏览器禁止使用者输入空值。

### 设定使用者

来到函式 `setUpUser`，这里你能找到 apiKey 与 regionName 被存到 Local Storage 中。新增函式：

```JavaScript
function setUpUser(apiKey, regionName) {
	localStorage.setItem('apiKey', apiKey);
	localStorage.setItem('regionName', regionName);
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';
	//建立初始化呼叫
	displayCarbonUsage(apiKey, regionName);
}
```
这个函式设定当 API 被呼叫时，显示读取讯息。到这里，你即将建立这个扩充功能专案最重要的函式！

### 显示碳排放量

最后，是时候查询 API 了！

在前往下一步前，我们先来讨论何谓 API。API，[Application Programming Interfaces](https://www.webopedia.com/TERM/A/API.html)，是网页开发者工具箱内最重要的成员。它们提供程式标准的互动模式与沟通介面，举例来说，如果你建立一个需要存取资料库的网页，资料库方可能就有人建立了 API 供你使用。API 有各式各样的种类，最普遍使用的为[REST API](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/)。

✅ 'REST' 全名为 'Representational State Transfer'，提供各式各样 URL 形式来抓取资料。对网路开发者的 API 种类做一点研究，什么形式的 API 最吸引你？

这条函式中有一个重要到值得纪录的事情。第一点为[关键字 `async`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)。让你的函式非同步地执行，在行为完成前做等待，譬如资料被回传。

这里有一个简短的影片介绍 `async`：

[![Async 与 Await 处理 promises 物件](https://img.youtube.com/vi/YwmlRkrxvkk/0.jpg)](https://youtube.com/watch?v=YwmlRkrxvkk "Async 与 Await 处理 promises 物件")

> 点击上方图片以观赏关于 async/await 的影片。

建立新的函式来询问 C02Signal 的 API：

```JavaScript
import axios from '../node_modules/axios';

async function displayCarbonUsage(apiKey, region) {
	try {
		await axios
			.get('https://api.co2signal.com/v1/latest', {
				params: {
					countryCode: region,
				},
				headers: {
					'auth-token': apiKey,
				},
			})
			.then((response) => {
				let CO2 = Math.floor(response.data.data.carbonIntensity);

				//calculateColor(CO2);

				loading.style.display = 'none';
				form.style.display = 'none';
				myregion.textContent = region;
				usage.textContent =
					Math.round(response.data.data.carbonIntensity) + ' grams (grams C02 emitted per kilowatt hour)';
				fossilfuel.textContent =
					response.data.data.fossilFuelPercentage.toFixed(2) +
					'% (percentage of fossil fuels used to generate electricity)';
				results.style.display = 'block';
			});
	} catch (error) {
		console.log(error);
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we have no data for the region you have requested.';
	}
}
```

这是一个挺大的函式，发生了什么事？

- 遵循程式实践过程，你使用关键字 `async` 让函式非同步地作行为。函式内的 `try/catch` 区块会在 API 回传资料时回传 promise 物件。因为我们无法控制 API 会多快地回应讯息(甚至无法回应讯息！)，你需要处理这种不确定性的时序关系。 
- 借由提供 API Key 访问 co2signal API 以取得你的地区资料。要使用这把钥匙，你必须在网页标头中新增认证参数。
- 当 API 回应时，你将各种物件填入回传的数值，并输出到画面上中。
- 如果发生错误，或没有结果产生，输出错误讯息。

✅ 非同步程式设计是一种实用的工具。阅读[更多使用方法](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)设定非同步程式的程式码。

恭喜你！当你建制你的专案(`npm run build`)并在浏览器上刷新功能，你有个可以运作的应用套件了！现在只差图示无法正常显示，我们会在下一堂课中修正它。

---

## 🚀 挑战

我们在课程中讨论了不同种类的 API。选择一样网页 API 并做更深度的研究。举例来说，看看浏览器内支援的 API 如 [HTML Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)。依你看，什么决定了 API 的优劣？

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/26?loc=zh_tw)

## 复习与自学

这堂课你学会关于 LocalStorage 与 API，它们对资深网页开发者提供很大的帮助。你能想想这两样东西如何彼此相互合作呢？想想你会如何建构你的网页，让 API 得以使用你所储存的资料。

## 作业

[认领一项 API](assignment.zh-cn.md)

