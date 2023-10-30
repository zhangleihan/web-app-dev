# 建立银行网页应用程式 Part 4： 状态控管的概念

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/47?loc=zh_tw)

### 大纲

随著网页应用越来越庞大，追踪资料流的动向也是一种挑战。程式取得了何种资料、网页如何处理它、何时何处被更新上去……这些很容易地导致程式码凌乱而难以维护。尤其是当你需要在不同页面上做资料共享时，好比说使用者的资料。*状态控管(state management)* 的观念已经存在于所有程式中，我们也开始需要在开发复杂的网页应用程式时，注意这个关键点。

在这个最终章内，我们会总览整个程式并重新思考该如何管理程式状态，让浏览器能在任何时刻做重新整理，在不同的使用者阶段维持资料的状态。

### 开始之前

你需要先完成[取得资料](../3-data/translations/README.zh-tw.md)的网页开发章节。你还需要安装 [Node.js](https://nodejs.org) 并于本地端[执行伺服器 API](../api/translations/README.zh-tw.md)以管理使用者资料。 

你可以测试伺服器是否运作正常，在终端机中输入指令：

```sh
curl http://localhost:5000/api
# -> should return "Bank API v1.0.0" as a result
```

---

## 思考状态控管

在[前一堂课](../3-data/translations/README.zh-tw.md)中，我们介绍了应用程式基本的状态，全域变数 `account` 提供登入帐户的相关银行资料。然而，现在的专案存在著一些瑕疵。试著在仪表板介面中重新整理。发生了什么事？

目前我们的程式码有三个问题：

- 网页状态并没有被储存，当浏览器重新整理时，会被导回登入页面。
- 有许多函式会修改网页状态。随著应用程式变大，我们很难去追踪之后的改变，时刻地去更新相关的网页状态。
- 网页状态并不完整，当你*登出*帐户时，帐户资讯仍然显示在登入页面上。

我们是可以逐一的解决这些问题，但这样会创造出许多独立的程式码，让应用程式更复杂而难以去管理。或者是我们停下来思考一下我们的策略。

> 我们究竟要解决什么问题？

[状态控管(State management)](https://en.wikipedia.org/wiki/State_management)可以为两项问题提供良好的解决方案：

- 如何让应用程式中的资料流容易理解？
- 如何让网页状态一直与使用者介面，或是相关物件进行同步？

一旦你处理好这些问题，其他问题可以被简化，甚至被一并解决。有许多可能的方法能解决这些问题，但我们使用一种常见的解法：**中心化资料与更新方式**。资料流会呈现下列模式：

![HTML、使用者行为与网页状态的架构图](./images/data-flow.png)

> 我们不会处理如何让资料同步触发页面的更新，这比较像是关于[回应式程式设计](https://zh.wikipedia.org/wiki/%E5%93%8D%E5%BA%94%E5%BC%8F%E7%BC%96%E7%A8%8B)的更进阶知识。当你更深入网页开发领域时，这是个很好的发展方向。

✅ 有许多函式库提供状态管理的方式，[Redux](https://redux.js.org) 就是常见的选择。阅读它的概念与运作模式，这是种有效的的学习方式，让你在大型的网页开发中预测潜在的风险，并预想解决方案。

### 课题

我们会先做一些程式重构。替换掉 `account` 的定义：

```js
let account = null;
```

变成：

```js
let state = {
  account: null
};
```

这个构想是要*中心化*应用程式资料到一个状态物件中。目前我们只有 `account` 在状态中，但这能提供未来新增新功能的基础。

我们还需要更新与它相关的函式。在函式 `register()` 和 `login()` ，将 `account = ...` 替换为 `state.account = ...`。

在函式 `updateDashboard()` 的上方，加入此行：

```js
const account = state.account;
```

这个重构并不会带来任何提升，但这是之后改变上的基础。
This refactoring by itself did not bring much improvements, but the idea was to lay out the foundation for the next changes.

## 追踪资料改变

现在我们有 `state` 物件储存资料了，接下来要来中心化这些更新。目标是能轻易地追踪任何被触发的改变。

为了避免改动 `state` 物件，我们考虑使它[*不可变*](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8F%AF%E8%AE%8A%E7%89%A9%E4%BB%B6)，意味著它不能被做任何的修改。
这也代表你必须建立新的状态物件来替换它。借由这个方式，你就有一套保护措施阻绝潜在非预期[风险](https://zh.wikipedia.org/wiki/%E5%89%AF%E4%BD%9C%E7%94%A8_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))，也开创出应用程式内还原与重做的功能，让程式侦错更加的容易。举例来说，你可以纪录状态的改变，储存状态的历史纪录来了解错误的来源。

在 JavaScript 中，你可以使用 [`Object.freeze()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 来建立不可变物件。若你想在不可变物件上做更动，例外处理(exception)就会发生。

✅ 你知道*浅复制(shallow)*和*深复制(deep)*这两种不可变物件的差别吗？你可以从[这里](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#What_is_shallow_freeze)阅读相关资讯。

### 课题

我们来建立新的函式 `updateState()`：

```js
function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData
  });
}
```

在这个函式中，我们会建立新的状态物件，并利用[*展开运算子(`...`)(Spread Operator)*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals)复制前一个资料状态。接著，我们使用[括弧记法(Bracket Notation)](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties) `[property]` 赋予并覆盖特定的状态物件。最后，我们为物件上锁，`Object.freeze()` 避免任何的改动。目前我们只有 `account` 资料存在状态中，利用此方法可以让你新增任何你想要的资料。

我们会更新 `state` 初始化设定，确保初始状态也被上锁：

```js
let state = Object.freeze({
  account: null
});
```

接著，更新函式 `register`，将 `state.account = result;` 替换为：

```js
updateState('account', result);
```

在函式 `login` 上做一样的事，将 `state.account = data;` 替换为：

```js
updateState('account', data);
```

借由这个机会，我们能解决帐户资料在*登出*时，不会被清除的问题。

建立新的函式 `logout()`：

```js
function logout() {
  updateState('account', null);
  navigate('/login');
}
```

在 `updateDashboard()` 中，替换重新导向 `return navigate('/login');` 为 `return logout()`。

试著注册新的帐户，登入登出以确保功能都运作正常。

> 提示：你可以观察所有的状态改变，在 `updateState()` 里的最下方加入 `console.log(state)`，开启浏览器开发工具，命令栏就会显示状态的纪录。

## 纪录状态

多数的网页应用程式需要储存资料以确保运作正常。所有重要的资料都会存在资料库中，并借由伺服器 API 来存取，就像我们专案中的帐户资料。但有时候，浏览器用户端的应用程式也需要储存一些资料，提供更好的使用者体验与增进负载效能。

当你想在浏览器内储存资料，你必须思考几项重要的问题：

- *这项资料很危险吗？* 你应该要避免在用户端储存敏感的资料，例如帐户密码。
- *你需要储存资料多久？* 你打算短时间内做存取，还是永久地保存？

网页应用程式中有许多储存资讯的方法，一切都取决于你想达成的目标。举例来说，你可以利用网址来储存搜寻资讯，让使用者间能共享资讯。若资料需要与伺服器共享，好比说[认证](https://zh.wikipedia.org/wiki/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81)资讯，你可以使用 [HTTP cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies)。

另一个选择是使用其中一个广大的浏览器 API 来储存资料。下列这两项就特别有趣：

- [`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage)：[Key/Value 储存法](https://zh.wikipedia.org/wiki/%E9%94%AE-%E5%80%BC%E5%AD%98%E5%82%A8)可以保存不同时刻的网页资料。这些资料不会有期限的限制。
- [`sessionStorage`](https://developer.mozilla.org/docs/Web/API/Window/sessionStorage)：它的运作模式与 `localStorage` 相同，只差在资料会在网页段落结束时被清除，如浏览器关闭时。

纪录一下这两个 API 只能储存[字串](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)格式。
如果你想储存更复杂的物件，你需要利用 [`JSON.stringify()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 将资料整理成 [JSON](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON) 格式。

✅ 如果你想要建立不仰赖伺服器的网页应用程式，你有办法在用户端建立资料库。[`IndexedDB` API](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) 可以应用在更进阶的案例上，储存更大量的资料，当然使用上也相对复杂。

### 课题

我们想让使用者在登出之前，保持登入状态。所以我们使用 `localStorage` 来储存帐户资料。首先，定义一组 key 来纪录我们的资料内容。

```js
const storageKey = 'savedAccount';
```

在函式 `updateState()` 末端加入此行：

```js
localStorage.setItem(storageKey, JSON.stringify(state.account));
```

借由此方式，帐户资料就能保存下来，并随著之前中心化后的状态而更新。我们开始从之前的重构获取效益了 🙂。

当资料被储存后，我们还需要在程式读取时载入资料。在 `app.js` 下方编写更多的初始化程式，建立新的函式 `init` 并收入之前的程式码：

```js
function init() {
  const savedAccount = localStorage.getItem(storageKey);
  if (savedAccount) {
    updateState('account', JSON.parse(savedAccount));
  }

  // 之前的初始化程式
  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();
```

我们在此接收了储存资料，并同步地更新状态资讯。这必须在更新路由*之前*完成，否则有些程式码会在页面更新时，依据状态来决定其行为。

当储存完帐户资料后，我们也定义了*仪表板*页面为我们的预设首页。若程式没有找到资料，仪表板页面也能重新导向回*登入*页面。在 `updateRoute()` 中，替换回传值 `return navigate('/login');` 为 `return navigate('/dashboard');`。

登入应用程式并重新整理页面。你应该能维持在仪表板那页。这个改变也解决了我们最初面临的问题......

## 重整资料

......但我们可能也产生了新问题。啊呀！

使用 `test` 帐户进入仪表板页面，在终端机内执行下列指令以建立新的交易项目：

```sh
curl --request POST \
     --header "Content-Type: application/json" \
     --data "{ \"date\": \"2020-07-24\", \"object\": \"Bought book\", \"amount\": -20 }" \
     http://localhost:5000/api/accounts/test/transactions
```

试著重新整理浏览器内仪表板页面。发生了什么事？你有看到新的交易项目吗？

感谢 `localStorage` 的帮助，状态成功的储存下来，但也代表我们在登出登入之前，不能再改变它的内容了！

一个可能的修复策略是在仪表板载入时，重新载入帐户资讯以避免资料不同步。

### 课题

建立新的函式 `updateAccountData`：

```js
async function updateAccountData() {
  const account = state.account;
  if (!account) {
    return logout();
  }

  const data = await getAccount(account.user);
  if (data.error) {
    return logout();
  }

  updateState('account', data);
}
```

这个方法能检查我们是否已经登入，重新从伺服器载入用户资料。

建立另一个函式 `refresh`：

```js
async function refresh() {
  await updateAccountData();
  updateDashboard();
}
```

这能更新帐户资料，更新 HTML 中的仪表板页面。这是在仪表板路由被载入时，我们所需要呼叫的函式。更新路由定义为：

```js
const routes = {
  '/login': { templateId: 'login' },
  '/dashboard': { templateId: 'dashboard', init: refresh }
};
```

试著重新载入仪表板，它现在应该能显示更新后的帐户资料。

---

## 🚀 挑战

每一次仪表板载入时，我们都会重新载入帐户资料，你认为我们还需要在用户端储存*所有的帐户*资料吗？

试著改变 `localStorage` 内的储存内容，只包含我们能运行程式的必要资料。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/48?loc=zh_tw)

## 作业

[编写"加入交易明细"视窗](./assignment.zh-cn.md)

这边有完成之后的结果：

!["加入交易明细"视窗的例子截图](./images/dialog.png)
