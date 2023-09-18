# 建立银行网页应用程式 Part 1：HTML 模板与网页路由

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/41?loc=zh_tw)

### 大纲

自从 JavaScript 出现在浏览器后，网页开始变得更复杂、更多互动。网页技术已经普遍地用于建立功能齐全的应用程式，执行在浏览器上，我们称之为[网页应用程式](https://zh.wikipedia.org/zh-tw/%E7%BD%91%E7%BB%9C%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F)。基于网页应用程式的高互动性，使用者不会想在互动后做所有页面载入所需的等待。这也是为什么 JavaScript 使用 DOM 来更新 HTML，提供使用者更流畅的网页体验。

在这堂课程中，我们会谱出银行网页应用程式的基础，使用 HTML 模板建立不同的画面，各自显示并更新内容，而不必每次都需要载入整个 HTML 页面。

### 开始之前

你需要一个网页伺服器来测试我们要建的专案。如果你还没有，你可以安装 [Node.js](https://nodejs.org) 并在你的专案资料夹中使用指令 `npx lite-server`。这会建立一个本地端的网页伺服器，在浏览器上开启你的网页程式。

### 准备

在你的电脑上，建立资料夹 `bank`，并在里面建立档案 `index.html`。我们以这个 HTML [样板](https://en.wikipedia.org/wiki/Boilerplate_code)来开始：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bank App</title>
  </head>
  <body>
    <!-- This is where you'll work -->
  </body>
</html>
```

---

## HTML 模板(templates)

如果你想在同一个网页上建立不同的画面，其中一种方法是各自建立一个 HTML 档给每一个你想呈现的子画面。然而，这个方式有许多不便之处：

- 你需要在切换页面时，重新载入整个网页。这会很花时间。
- 在不同子页面上共享数据会是一大难题。

另一个解决方案是只有一个 HTML 档案，并使用 `<template>` 元素定义多个 [HTML 模板](https://developer.mozilla.org/docs/Web/HTML/Element/template)。
一个模板提供可重复利用的 HTML 区块，它不会显示在浏览器上，而在需要之时由 JavaScript 以呈现出来。

### 课题

我们会建立一个银行网页应用程式，其中包含两个子画面：登入页面与仪表板页面。首先，我们在网页应用程式的 HTML body 上，建立放置区来放置模板的子页面。

```html
<div id="app">Loading...</div>
```

我们给它 `id`，以利后续 JavaScript 对它的追踪。

> 提示：因为它里面元素的内容会被置换，我们可以建立载入中讯息或提示，在应用程式载入时显示出来。

接下来，我们加入下列的 HTML 模板，给登入画面使用。现在我们只加入一行标题与一个有连结的区块，进行简单的功能。

```html
<template id="login">
  <h1>Bank App</h1>
  <section>
    <a href="/dashboard">Login</a>
  </section>
</template>
```

接著，加入另一个 HTML 模板给仪表板页面。这个页面就会包含不同的区块：

- 包含标题与登出连结的网页标头
- 现在的银行帐户馀额
- 一个历史交易清单的表格

```html
<template id="dashboard">
  <header>
    <h1>Bank App</h1>
    <a href="/login">Logout</a>
  </header>
  <section>
    Balance: 100$
  </section>
  <section>
    <h2>Transactions</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Object</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </section>
</template>
```

> 提示：在建立 HTML 模板时，如果你想知道它的呈现样子为何，你可以注解掉 `<template>` 与 `</template>`。使用 `<!-- -->` 来注解它们。

✅ 你知道为什么我们需要使用模板的 `id` 属性吗？我们可以使用别的属性，例如 classes 吗？

## 利用 JavaScript 显示模板

现在，如果你使用浏览器打开你的应用程式，你会看到画面卡在 `Loading...` 的画面。那是因为我们需要为它新增一些 JavaScript 的程式码来显示出这些 HTML 模板。

展现模板通常需要三个步骤：

1. 在 DOM 内接收模板元素，举例来说，使用 [`document.getElementById`](https://developer.mozilla.org/docs/Web/API/Document/getElementById)。
2. 复制模板元素，使用 [`cloneNode`](https://developer.mozilla.org/docs/Web/API/Node/cloneNode)。
3. 将复制元素接到 DOM 的显示元素上，例如使用 [`appendChild`](https://developer.mozilla.org/docs/Web/API/Node/appendChild)。

✅ 我们为什么需要在接到 DOM 前，复制一份模板？你能想像如果我们省略了此步骤后，会发生什么事吗？

### 课题

在资料夹中建立新档案 `app.js`，并在你的 HTML 档案的 `<head>` 区块中中汇入这个新档案：

```html
<script src="app.js" defer></script>
```

在 `app.js` 中，我们建立新函式 `updateRoute`：

```js
function updateRoute(templateId) {
  const template = document.getElementById(templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(view);
}
```

这里做的事情就是我们上述提及过的三个步骤。我们使用 `templateId` 展现了模板，并将复制的内容接在我们的放置区中。注意我们需要使用 `cloneNode(true)` 来复制整个模板的子树。

现在我们呼叫这个函式，指定特定的模板并观察结果。

```js
updateRoute('login');
```

✅ 程式码中 `app.innerHTML = '';` 的目的为何？如果删去它会发生什么事？

## 建立网页路由(Routing)

当提及网页应用程式时，我们称呼 *路由(Routing)* 来连接**网址(URLs)**到特定的画面上，呈现相关内容。一个含有多个 HTML 档的网页，网址又象征著档案路径，这能自动地完成网址与档案的转换。举例来说，专案资料夹内有这些档案：

```
mywebsite/index.html
mywebsite/login.html
mywebsite/admin/index.html
```

若我们建立网路伺服器，根目录为 `mywebsite`，则 URL 路由为：

```
https://site.com            --> mywebsite/index.html
https://site.com/login.html --> mywebsite/login.html
https://site.com/admin/     --> mywebsite/admin/index.html
```

然而，在我们的网页应用中，我们使用单一个 HTML 档包含所有的子画面到其中，所以预设的路由行为并不能帮助到本次专案。我们需要手动进行连接，使用 JavaScript 更新该被显示出来的模板。

### 课题

我们使用简单的物件来达成 URL 网址与模板的[关联实体关系](https://en.wikipedia.org/wiki/Associative_array)。加入这个物件到 `app.js` 档案的最上方。

```js
const routes = {
  '/login': { templateId: 'login' },
  '/dashboard': { templateId: 'dashboard' },
};
```

现在，我们对函式 `updateRoute` 做一些更动。我们不直接将 `templateId` 作为参数传递，而是接收现在的 URL 网址，在使用关联表来取得相对应的模板 ID 数值。我们可以使用 [`window.location.pathname`](https://developer.mozilla.org/docs/Web/API/Location/pathname) 来取得网址的部分路径。

```js
function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(view);
}
```

这边我们建立了模板的路由关系。你可以借由修改网址，来测试你的网页是否正确的转移。

✅ 如果你输入了不存在的网址，它会发生什么事？我们该如何解决呢？

## 加入网页访问

下一个步骤为在不更改网址的情况下，新增网页访问的途径。这会做出两件事情：

  1. 更新现在的网址
  2. 更新要被显示的模板到新的网址中

我们已经完成了第二点，借由使用函式 `updateRoute` 来完成，所以我们需要厘清该如何更新现在的网址。

我们需要使用 JavaScript，详细来看为 [`history.pushState`](https://developer.mozilla.org/docs/Web/API/History/pushState)，更新网址位置并建立浏览纪录，同时不更新整个 HTML 页面。

> 笔记：网页超连结元素 [`<a href>`](https://developer.mozilla.org/docs/Web/HTML/Element/a) 可以建立不同网址的连接，但它预设上会让浏览器重新载入 HTML 档。我们需要手动新增 JavaScript 处理路由以避免此行为发生，在点击事件中使用函式 preventDefault() 。

### 课题

我们来建立新的函式，让应用程式得以做网页的访问：

```js
function navigate(path) {
  window.history.pushState({}, path, path);
  updateRoute();
}
```

这个方法根据导入的路径位置，更新了现在的网址位置，再更新模板上去。`window.location.origin` 回传了网址的根路径，允许我们重新构筑完整的网址。

现在，借由上述的函式，我们可以解决找不到网页路径的问题。我们修改函式 `updateRoute`，在找不到该网页时强制转移到一个存在的网页。

```js
function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    return navigate('/login');
  }

  ...
```

如果找不到网页路由时，我们会导往 `login` 的页面。

现在，我们建立新的函式，在连结被点击时取得网址位置，并避免浏览器进行预设上的重新载入：

```js
function onLinkClick(event) {
  event.preventDefault();
  navigate(event.target.href);
}
```

现在我们完成应用程式的网页访问系统，在 HTML 档的 *Login* 与 *Logout* 连结加入此函式。

```html
<a href="/dashboard" onclick="onLinkClick(event)">Login</a>
...
<a href="/login" onclick="onLinkClick(event)">Logout</a>
```

使用 [`onclick`](https://developer.mozilla.org/docs/Web/API/GlobalEventHandlers/onclick) 属性会将 `click` 事件连接到 JavaScript 程式码中，这边会再呼叫函式 `navigate()`。

试著点击这些连结，你应该能造访网页中不同的的画面了。

✅ `history.pushState` 这个方法是 HTML5 标准的一部份，支援在[所有当代的浏览器](https://caniuse.com/?search=pushState)上。如果你要为旧款的浏览器设计网页应用程式的话，这边有一个技巧来加在这个 API 上：在路径前面加上 [hash (`#`)](https://en.wikipedia.org/wiki/URI_fragment)，你可以完成网页路由与不须重载网页的功能，它的目的就是在同一个网页中做内部连结的切换。

## 处理浏览器的「上一页」与「下一页」

使用 `history.pushState` 会建立浏览器的浏览纪录。你可以使用浏览器的*上一页*来确认，它应该要能呈现像这样的画面：

![浏览历史的截图](../history.png)

点击上一页数次，你会看到网址会改变且历史纪录也更新上去了，但同一个模板还是被显示出来。

这是因为网页不知道该如何依据历史纪录来呼叫 `updateRoute()`。如果你阅读了 [`history.pushState` 技术文件](https://developer.mozilla.org/docs/Web/API/History/pushState)，你会发现如果状态改变 ── 同时代表著网址改变 ── [`popstate`](https://developer.mozilla.org/docs/Web/API/Window/popstate_event) 事件就会被触发。我们会利用此特征来修复这个问题。

### 课题

为了在浏览器历史改变时更新该被显示的模板，我们会以新函式来呼叫 `updateRoute()`。我们在 `app.js` 档最下方加入：

```js
window.onpopstate = () => updateRoute();
updateRoute();
```

> 笔记：我们在这里使用[箭头函式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，简短地宣告 `popstate` 事件处理器。它与正规的函式的功能是一样的。

这是关于箭头函式的回想影片：

[![箭头函式](https://img.youtube.com/vi/OP6eEbOj2sc/0.jpg)](https://youtube.com/watch?v=OP6eEbOj2sc "箭头函式")

> 点击上方图片以观看关于箭头函式的影片。

现在，试著点击浏览器上的上一页与下一页，检查这次模板是否正确地更新出来。

---

## 🚀 挑战

加入新的模板与对应的关联表，显示出本应用程式第三页的功能 ── 帐户馀额。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/42?loc=zh_tw)

## 复习与自学

网页路由是网页开发中很棘手的部分，特别是将网页切换转变为单一页面应用程式(Single Page Application)。阅读关于[Azure Static Web App 提供服务的方式](https://docs.microsoft.com/azure/static-web-apps/routes/?WT.mc_id=academic-77807-sagibbon)以处理网页路由。你能解释为什么文件上的某些决定会如此重要呢？

## 作业

[增进网页路由](assignment.zh-cn.md)
