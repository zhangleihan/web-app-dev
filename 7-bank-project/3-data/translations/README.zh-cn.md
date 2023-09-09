# 建立银行网页应用程式 Part 3：取得并使用资料

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/45?loc=zh_tw)

### 大纲

每一个网页应用程式的核心为*资料*。资料有很多种格式，但它们的目的都是为了显示使用者需要的资讯。网页应用程式变得高互动性与复杂，使用者如何取得内容并与之进行互动变成网页开发重要的一环。

在这堂课中，我们会了解伺服器是如何非同步地取得资料，并在不重新载入 HTML 的情况下，利用这些资料显示在网页上。

### 开始之前

你需要先完成系列课程 ── [登入与注册表单](../../2-forms/translations/README.zh-tw.md)。你还需要安装 [Node.js](https://nodejs.org) 并[执行伺服器 API](../../api/translations/README.zh-tw.md)。

你可以测试伺服器是否运作正常，在终端机中输入指令：

```sh
curl http://localhost:5000/api
# -> 会回传结果 "Bank API v1.0.0"
```

---

## AJAX 和取得资料

传统的网页在使用者点击连结，或是提交表单资料时，重新载入全部的 HTML 页面来更新网页内容。每当资料要被更新时，伺服器就需要回传全新的 HTML 页面给浏览器处理，同时也干涉到使用者正在进行的动作，重新载入的机制也限制了许多互动功能。这种工作流程被称为*多页面应用程式(Multi-Page Application)*，简称 *MPA*。

![多页面应用程式的更新流程](../images/mpa.png)

网页应用程式变得更加复杂，促使新的技术问世：[AJAX (Asynchronous JavaScript and XML)](https://zh.wikipedia.org/wiki/AJAX)。

这个技巧允许网页应用程式使用 JavaScript 非同步地传递与接收伺服器的资料，不需要重新载入 HTML 页面，也反映在更快速的更新速率与更流畅的使用者体验。在接收伺服器的新资料时，目前的 HTML 页面可以被 JavaScript 利用 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) API 更新。自此之后，这种流程演变成现今的[*单一页面应用程式(Single-Page Application)*，*SPA*](https://zh.wikipedia.org/wiki/%E5%8D%95%E9%A1%B5%E5%BA%94%E7%94%A8)。

![单一页面应用程式的更新流程](../images/spa.png)

在 AJAX 早期，唯一取得资料的 API 为 [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)。但当代的浏览器已经建立出更方便且强大的 [`Fetch` API](https://developer.mozilla.org/docs/Web/API/Fetch_API)，它们使用 Promises 物件且更适合应用在 JSON 资料上。

> 许多当代浏览器支援 `Fetch API`，如果你想确认你的网页应用程式是否运作在旧款的浏览器，检查 [caniuse.com 上的相容性测试](https://caniuse.com/fetch)是一个好方法。

### 课题

在[前一堂课程中](../../2-forms/translations/README.zh-tw.md)，我们制作出注册表单来建立新帐户。现在我们来加入新程式，使用现有的帐户登入，并取得其相关资料。开启档案 `app.js` 并新增函式 `login`：

```js
async function login() {
  const loginForm = document.getElementById('loginForm')
  const user = loginForm.user.value;
}
```

现在我们利用 `getElementById()` 接收表单元素，并借由 `loginForm.user.value` 取得输入框内的使用者名称。每一个表单控制可以以各自名称(即 HTML 内的 `name` 属性)来存取。

就像我们为注册帐户作的事一样，我们建立另一个函式来执行伺服器请求，但这次是为了取得帐户资料：

```js
async function getAccount(user) {
  try {
    const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}
```

我们使用 `fetch` API 来向伺服器做非同步资料请求。这次我们不需要添加额外的参数，如网址，我们只询问资料内容。预设上，`fetch` 建立出 [`GET`](https://developer.mozilla.org/docs/Web/HTTP/Methods/GET) HTTP 请求，即我们想做的事情。

✅ 函式 `encodeURIComponent()` 可以转换网址内的特殊字元。如果我们不呼叫这个函式，而是直接将 `user` 这项数值放入网址中，这会发生什么问题？

让我们来更新函式 `login`，使用 `getAccount`：

```js
async function login() {
  const loginForm = document.getElementById('loginForm')
  const user = loginForm.user.value;
  const data = await getAccount(user);

  if (data.error) {
    return console.log('loginError', data.error);
  }

  account = data;
  navigate('/dashboard');
}
```

首先，`getAccount` 是一个非同步函式，它利用关键字 `await` 等待伺服器的回传结果。就如其他伺服器请求一样，我们也必须要处理错误的情况。现在我们只加错误讯息给这些情况，之后再回过头解决这些问题。

接著，我们必须储存资料，在之后可以输出成仪表板的资讯。目前变数 `account` 还没存在，我们建立它的全域变数在档案最上方：

```js
let account = null;
```

在用户资料存到变数中后，我们可以使用函式 `navigate()` 从*登入*页面切换到*仪表板*页面。

最后，在登入表单提交时，呼叫函式 `login`。修改 HTML 语法：

```html
<form id="loginForm" action="javascript:login()">
```

测试注册功能，以及新注册的帐户的登入行为是否运作正常。

在进行下一步骤前，我们还必须完成函式 `register`。在此函式的最下方加入：

```js
account = result;
navigate('/dashboard');
```

✅ 你知道在预设上，你只能从*同一个网域(domain)与连接埠(port)*的网页呼叫伺服器 APIs 吗？这是浏览器强制性的安全机制。但我们的网页应用程式在 `localhost:3000` 上执行，而伺服器 API 则在 `localhost:5000` 上执行。为什么这样能正常运作？利用[跨来源资源共用 (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS)，只要伺服器添加特殊的标头档到网页回应中，我们就可以处理跨资源的 HTTP 请求，允许特殊的网域进行呼叫。

> 借由前往[此课程](https://docs.microsoft.com/learn/modules/use-apis-discover-museum-art/?WT.mc_id=academic-77807-sagibbon)学习更多有关 API 的资讯。

## 更新 HTML 显示资料

现在取得完用户资料，我们必须更新到现有的 HTML 上。我们已经知道如何接收 DOM 的元素，例子为 `document.getElementById()`。只要你有元素，这边有一些 API 让你修改，或是新增子元素上去：

- 使用 [`textContent`](https://developer.mozilla.org/docs/Web/API/Node/textContent) 属性，你可以改变元素的文字内容。注意改变此数值会删除它的所有子元素(若存在的话)，并以该文字内容来替换它。同时，这也是个有效的方法来删去所有的子成员，只要赋予它空字串 `''`。

- 使用 [`document.createElement()`](https://developer.mozilla.org/docs/Web/API/Document/createElement) 与 [`append()`](https://developer.mozilla.org/docs/Web/API/ParentNode/append) 这两方法，你可以建立并接上一到多个子元素成员。

✅ 使用 [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) 元素属性也能改变 HTML 的内容，但这方法要避免使用。这可能会遭遇有关[跨网站指令码 (XSS)](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting)的攻击。

### 课题

在来到仪表板画面之前，我们还需要帮*登入*页面加一件事。目前，如果你试著使用不存在的帐户进行登入，讯息只会出现在命令栏中，而使用者不会发觉到任何事情改变，也不清楚网页发生了什么事。

我们在登入表单中新增显示错误讯息的地方。最好的地方为登入按钮 `<button>` 之前：

```html
...
<div id="loginError"></div>
<button>Login</button>
...
```

这个 `<div>` 元素为空的，代表著画面不会印出任何讯息，直到我们添加内容进去。我们还给了它 `id`，让 JavaScript 可以容易地存取它。

回到档案 `app.js`，建立新的补助函数 `updateElement`：

```js
function updateElement(id, text) {
  const element = document.getElementById(id);
  element.textContent = text;
}
```

这条就很直观：给定元素的 *id* 与 *text*，它会更新 DOM 元素内符合 `id` 条件的文字内容。我们也使用这个方法到前面 `login` 函式的错误讯息中：

```js
if (data.error) {
  return updateElement('loginError', data.error);
}
```

现在，试著以不合法的帐户进行登入，你应该能看到像这样的画面：

![登入出现错误讯息之截图](../images/login-error.png)

现在我们印出错误讯息，但萤幕报读器并没有做任何报读。为了让被动态加入的文字能被萤幕报读器阅读出来，我们需要使用 [Live Region](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)。这边我们使用一种 Live Region 的类型 alert：

```html
<div id="loginError" role="alert"></div>
```

建立同样的行为到函式 `register` 的错误讯息当中，也别忘了更新你的 HTML。

## 在仪表板显示资讯

使用同样的技巧，我们需要将帐户资讯印在仪表板页面中。

这是从伺服器接收到的帐户资料物件：

```json
{
  "user": "test",
  "currency": "$",
  "description": "Test account",
  "balance": 75,
  "transactions": [
    { "id": "1", "date": "2020-10-01", "object": "Pocket money", "amount": 50 },
    { "id": "2", "date": "2020-10-03", "object": "Book", "amount": -10 },
    { "id": "3", "date": "2020-10-04", "object": "Sandwich", "amount": -5 }
  ],
}
```

> 笔记：为了让开发更加的容易，你可以使用已经存在资料的帐户 `test`。

### 课题

我们开始置换掉 HTML 档内的 "Balance" 区域，加入放置区：

```html
<section>
  Balance: <span id="balance"></span><span id="currency"></span>
</section>
```

我们还需要在下方新增区域来显示帐户资讯：

```html
<h2 id="description"></h2>
```

✅ 表示帐户资讯的函式刚好为在内容的标题处，我们可以将它作为语义化的标头。学习更多关于[标头结构](https://www.nomensa.com/blog/2017/how-structure-headings-web-accessibility)，它对于网页亲和力格外重要，也明显地表达出页面的标头位置。

接著，我们在 `app.js` 档案中加入新的函式来为放置区新增内容：

```js
function updateDashboard() {
  if (!account) {
    return navigate('/login');
  }

  updateElement('description', account.description);
  updateElement('balance', account.balance.toFixed(2));
  updateElement('currency', account.currency);
}
```

首先，我们需要先检查帐户的资料。使用我们之前建立的函式 `updateElement()` 来更新 HTML 档。

> 为了让帐户馀额漂亮地呈现，我们使用 [`toFixed(2)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 这个方法，强迫数值只显示到小数点第二位。

现在，每当仪表板被载入时，我们就需要呼叫函式 `updateDashboard()`。如果你已经完成[课程一的作业](../../1-template-route/translations/assignment.zh-tw.md)，就不需要额外做处理，不然你可以使用接下来的设定。

加入这段程式码到函式 `updateRoute()` 的下方：

```js
if (typeof route.init === 'function') {
  route.init();
}
```

并更新路由定义：

```js
const routes = {
  '/login': { templateId: 'login' },
  '/dashboard': { templateId: 'dashboard', init: updateDashboard }
};
```

做完这些更动后，当仪表板要被呈现时，函式 `updateDashboard() 就会被呼叫。在你登入后就能看到帐户的描述、馀额与交易状况。

## 利用 HTML 模板动态建立表格列

在[第一堂课](../../1-template-route/translations/README.zh-tw.md)中，我们使用 HTML 模板与方法 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) 来做出应用程式内的转换。模板还能执行更小规模的行为，动态地改变一部份的页面

我们使用类似的方式来显示 HTML 表格中的交易清单。

### 课题

加入新的模板到 HTML 的 `<body>` 中：

```html
<template id="transaction">
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</template>
```

这个模板表示单一条的表格列，其中包含了三格栏位：交易的*日期*、*物件* 与 *金额*。

接著，加入 `id` 属性到模板的表格 `<tbody>` 元素中，让 JavaScript 能更容易地取得：

```html
<tbody id="transactions"></tbody>
```

当我们的 HTML 准备好时，我们切换到 JavaScript 档案中，加入新函式 `createTransactionRow`：

```js
function createTransactionRow(transaction) {
  const template = document.getElementById('transaction');
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector('tr');
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return transactionRow;
}
```

这个函式做就如它名字的功能：借由刚建立的模板，建立出新的表格列并填入交易明细的资料。我们会在函式 `updateDashboard()` 中，利用它来更新表格：

```js
const transactionsRows = document.createDocumentFragment();
for (const transaction of account.transactions) {
  const transactionRow = createTransactionRow(transaction);
  transactionsRows.appendChild(transactionRow);
}
updateElement('transactions', transactionsRows);
```

这里我们使用了方法 [`document.createDocumentFragment()`](https://developer.mozilla.org/docs/Web/API/Document/createDocumentFragment)，建立新的 DOM 分段，再接到我们的 HTML 表格中。

我们还需要做一件事才能让程式运作正常，目前函式 `updateElement()` 只能接受文字类型的内容。我们稍微修改一下程式码：

```js
function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  element.textContent = ''; // Removes all children
  element.append(textOrNode);
}
```

我们使用方法 [`append()`](https://developer.mozilla.org/docs/Web/API/ParentNode/append)，它能连接文字或者是 [DOM 节点](https://developer.mozilla.org/docs/Web/API/Node)到父元素中，正好满足我们的需求。

试著以 `test` 帐户来登入，你应该能看到仪表板显示出交易明细了 🎉。

---

## 🚀 挑战

花功夫让仪表板页面看起来像是正规的银行界面。如果你已经为你的应用程式做好造型，你可以试试 [media queries](https://developer.mozilla.org/docs/Web/CSS/Media_Queries) 来建立出[回应式网页设计](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Responsive/responsive_design_building_blocks)，它能完美地呈现在电脑或是行动装置上。

这边有造型过后的仪表板例子：

![造型化后的仪表板截图](../../images/screen2.png)

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/46?loc=zh_tw)

## 作业

[重构并注解你的程式码](assignment.zh-tw.md)
