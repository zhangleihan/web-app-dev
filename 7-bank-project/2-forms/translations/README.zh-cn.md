# 建立银行网页应用程式 Part 2：登入与注册表单

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/43?loc=zh_tw)

### 大纲

在大多数当代网页应用程式中，你可以建立自己的帐户来拥有自己的私人空间。许多用户在同一时间可以存取同一个网页应用程式，你就必须有一套机制分开储存不同用户的资料并显示适当的资讯。我们不会涉及到如何管理[用户个资的安全](https://zh.wikipedia.org/wiki/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81)，它是个相当广泛的主题，我们仅会确保每个用户能在这款银行应用上建立一到多个数位帐户。

在这单元中，我们会使用 HTML 表单来新增登入与注册的功能。我们会看到如何使用伺服器 API 传递资料，定义基本的用户字串输入之检查机制。

### 开始之前

你需要完成第一单元 [HTML 模板与网页路由](../../1-template-route/translations/README.zh-tw.md)的应用程式。你还需要安装 [Node.js](https://nodejs.org) 与在本地端[运行伺服器 API](../../api/translations/README.zh-tw.md) 以传输建立帐户所需的资料。

你可以测试伺服器是否运作正常，在终端机内输入指令：

```sh
curl http://localhost:5000/api
# -> 会回传结果 "Bank API v1.0.0" 
```

---

## 表单与其控制

`<form>` 元素打包了 HTML 文件中使用者输入与提交资料的地方。有许多种使用者介面(UI)以表单的方式呈现，最常见的内容会包含 `<input>` 与 `<button>` 元素。

有许多种 `<input>` 的[种类](https://developer.mozilla.org/docs/Web/HTML/Element/input)，举例来说，若要建立使用者输入使用者名称的地方，你可以：

```html
<input id="username" name="username" type="text">
```

`name` 属性同时亦是表单传输资料的名称。`id` 属性是用来与 `<label>` 做表单控制(form control)的连接。

> 花点时间看看 [`<input>` 种类](https://developer.mozilla.org/docs/Web/HTML/Element/input)的清单与[其他表单控制](https://developer.mozilla.org/docs/Learn/Forms/Other_form_controls)，让你在建立使用者介面时，有全部供你使用的原生 UI 元素可以参考。

✅ 纪录一下 `<input>` 是种[空元素](https://developer.mozilla.org/docs/Glossary/Empty_element)，你*不应该*在它后面加上对应的结束标籤。然而，你仍然可以在它的后面使用 `<input/>`，这没有强制规定。

表单中的 `<button>` 元素是有些特别。如果你没有指定它的 `type` 属性，它会在你输入文字时，自动地提交表单内容给伺服器。这边有一些你可以设定的 `type` 内容：

- `submit`： `<form>` 内的预设型态，按钮会触发表单提交这项行为。
- `reset`： 按钮会重置所有表单控制回初始状态。
- `button`： 在按钮按下时不执行预设行为。你可以借由 JavaScript 自由定义之后的动作。

### 课题

在 `login` 模板内加入表单。我们需要 *使用者名称(username)* 的输入框与 *登入(Login)* 的按钮。 

```html
<template id="login">
  <h1>Bank App</h1>
  <section>
    <h2>Login</h2>
    <form id="loginForm">
      <label for="username">Username</label>
      <input id="username" name="user" type="text">
      <button>Login</button>
    </form>
  </section>
</template>
```

如果你仔细地看，你会注意到我们在这里还加了 `<label>` 元素。`<label>` 元素被用来新增文字到 UI 上，譬如说我们的使用者名称。为了让表单得以被阅读，标籤是很重要的，此外它还有额外的优点：

- 连结标籤到表单控制上，它能帮助使用者的额外工具，好比说萤幕报读器，理解接下来该提供何种资料。
- 你可以点击标籤，它会跳转到相对应的输入框，让使用触控型装置的用户更容易操作。

> [网页亲和力](https://developer.mozilla.org/docs/Learn/Accessibility/What_is_accessibility)是非常重要但常被忽视的主题。感谢[语义化 HTML 元素](https://developer.mozilla.org/docs/Learn/Accessibility/HTML)的帮助，建立无障碍的网页内容变得更加容易。你可以[阅读更多有关网页亲和力的文章](https://developer.mozilla.org/docs/Web/Accessibility)，避免触犯到常见的错误并成为负责任的开发者。

现在，我们加入第二张表单给用户注册使用，就像前一张一样：

```html
<hr/>
<h2>Register</h2>
<form id="registerForm">
  <label for="user">Username</label>
  <input id="user" name="user" type="text">
  <label for="currency">Currency</label>
  <input id="currency" name="currency" type="text" value="$">
  <label for="description">Description</label>
  <input id="description" name="description" type="text">
  <label for="balance">Current balance</label>
  <input id="balance" name="balance" type="number" value="0">
  <button>Register</button>
</form>
```

借由 `value` 属性，我们可以定义输入框内的预设值。
注意一下 `balance` 的输入类型为 `number`。它看起来与其他输入框不一样吗？试著与它互动看看。

✅ 你能只利用键盘造访表格，与表格互动吗？你是如何做到的？

## 提交资料给伺服器

现在我们有可以使用的 UI 了，下一个步骤要将资料送给我们的伺服器。让我们来快速地测试一下程式：在点击 *Login* 或 *Register* 按钮后，发生了什么事？

你有注意到浏览器的网址列改变了吗？

![截图：点击 Register 按钮后，浏览器网址列改变](./images/click-register.png)

`<form>` 预设的行为：使用 [GET 方法](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3)提交表格，将表格资料接在网址后面，传送给目前网址的伺服器。然而这个方法有一些缺点：

- 资料大小有上限限制(大约 2000 字元)
- 可以直接在网址内看到资料(对密码而言，这并不恰当)
- 它不能做档案的上传

这也是为什么你需要将它转换为 [POST 方法](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5)，将表单资料存在 HTTP 请求的内容中。这样就不会遇到上述的限制。

> POST 是常见的资料传输方法，[在一些特别的情况下](https://www.w3.org/2001/tag/doc/whenToUseGet.html)，使用 GET 方法相对起来比较恰当。例如进行搜寻的时候。

### 课题

加入 `action` 与 `method` 属性到注册表单之中：

```html
<form id="registerForm" action="//localhost:5000/api/accounts" method="POST">
```

现在，试著以你的名字申请新的帐户。在点击 *Register* 按钮后，你应该能看到像这样的画面：

![浏览器网址为 localhost:5000/api/accounts，并显示 JSON 的资料字串。](./images/form-post.png)

若所有事情都运作正常，伺服器应该会回应你的请求，附带 [JSON](https://www.json.org/json-en.html) 包含著你刚建立的帐户资料。

✅ 试著以相同名字再注册一次。发生了什么事？

## 不重新载入地提交资料

你可能会注意到，这些行动间出现了一个小问题：在提交表单时，我们离开了网页应用，浏览器又重新导回到伺服器的网址。我们试著避免网页应用重新载入所有的页面，做出[单一页面应用程式 (SPA)](https://zh.wikipedia.org/zh-tw/%E5%8D%95%E9%A1%B5%E5%BA%94%E7%94%A8)。

为了让传递资料给伺服器时，不发生页面重新载入的情况，我们需要使用 JavaScript。 

比起直接在 `<form>` 元素的 `action` 属性加入网址，你可以使用 `javascript:` 字串接在程式语句前头来执行自订的行为。使用这方法也意味著你需要额外修改一些原本浏览器会做的行为。

- 接收表单资料
- 转换并编码表单资料成合适的格式
- 建立 HTTP 请求并传递给伺服器

### 课题

将注册表单的 `action` 替换为：

```html
<form id="registerForm" action="javascript:register()">
```

开启 `app.js`，加入新的函式 `register`：

```js
function register() {
  const registerForm = document.getElementById('registerForm');
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);
}
```

我们使用 `getElementById()` 蒐集表单的元素，使用 [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) 协助从表单控制中取出 key/value 的数据对。
之后，利用 [`Object.fromEntries()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) 转换资料成正规物件，最后再将档案转成 [JSON](https://www.json.org/json-en.html) ── 一个在网路上常见的资料交换格式。

现在资料已经准备提交给伺服器了。建立新函式 `createAccount`：

```js
async function createAccount(account) {
  try {
    const response = await fetch('//localhost:5000/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: account
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}
```

这个函式做了什么？首先，注意关键字 `async`，代表著函式包含了[**非同步化程式**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)。在与关键字 `await` 一起使用时，它会在继续运行程式前，等待非同步的程式被执行，就像等待伺服器回应一样。

这边有关于使用 `async/await` 的影片：

[![Async 与 Await 管理 promises](https://img.youtube.com/vi/YwmlRkrxvkk/0.jpg)](https://youtube.com/watch?v=YwmlRkrxvkk "Async 与 Await 管理 promises")

> 点击上方图片以观看关于 async/await 的影片。

我们使用 API `fetch()` 来传送 JSON 资料给伺服器。这个方法需要使用两个参数：

- 伺服器的网址，在此使用 `//localhost:5000/api/accounts`。
- 网页请求的设定，就是我们定义 `POST` 方法与提供请求的 `body`。当我们传输 JSON 资料给伺服器，我们还需要在标头的 `Content-Type` 定为 `application/json`，伺服器才知道该如何解读里面的内容。

当伺服器以 JSON 回应请求后，我们可以使用 `await response.json()` 来取得 JSON 的内容并回传结果。注意在此为非同步程式的方法，我们使用关键字 `await` 回传任何在解读封包时产生的错误讯息。

现在，在函式 `register` 中呼叫 `createAccount()`：

```js
const result = await createAccount(jsonData);
```

因为我们在这此使用了关键字 `await`，我们需要在注册函式前新增关键字 `async`：

```js
async function register() {
```

最后，我们储存一些纪录来检查结果。最后的函式应该会如下方格式：

```js
async function register() {
  const registerForm = document.getElementById('registerForm');
  const formData = new FormData(registerForm);
  const jsonData = JSON.stringify(Object.fromEntries(formData));
  const result = await createAccount(jsonData);

  if (result.error) {
    return console.log('An error occured:', result.error);
  }

  console.log('Account created!', result);
}
```

过程有些冗长，但我们达成了！当你开启[浏览器开发者工具](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)，试著注册新的帐户，你应该能看到网页并没有改变，但命令栏中会显示帐户成功注册的讯息。

![浏览器命令栏中显示纪录讯息之截图](../images/browser-console.png)

✅ 你觉得传给伺服器的资料是安全的吗？其他人有办法拦截网页请求吗？你可以阅读 [HTTPS](https://en.wikipedia.org/wiki/HTTPS)，了解更多关于安全的资料传输。

## 资料验证

试著在注册新帐户时，不输入你的使用者名称，你会发现伺服器回传了错误状态讯息：[400 (Bad Request)](https://developer.mozilla.org/docs/Web/HTTP/Status/400#:~:text=The%20HyperText%20Transfer%20Protocol%20(HTTP,%2C%20or%20deceptive%20request%20routing).)。

在传输资料给伺服器之前，最好先[验证表单资料](https://developer.mozilla.org/docs/Learn/Forms/Form_validation)，以确保我们传送合法的网页请求。 HTML5 表单控制内建包含了验证方法，使用了多样的属性： controls provides built-in validation using various attributes:

- `required`： 输入框必须被填写，否则表单不能被提交。
- `minlength` 和 `maxlength`： 定义输入框的文字下限与文字上限。
- `min` 和 `max`： 定义输入框的数字下限与数字上限。
- `type`： 定义输入框内的资料格式，例如`数字`、`email`、`档案`或是[其他内建的格式](https://developer.mozilla.org/docs/Web/HTML/Element/input)。这个属性可能会改变表单控制的表现方法。
- `pattern`： 允许定义[正规表示法](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions)的字串，测试输入的内容是否满足它。

> 提示：你可以自定义表单控制的呈现方法，利用 CSS pseudo-classes `:valid` 和 `:invalid` 判断内容是否合理。

### 课题

在建立新的合法帐户时，有两个必须被填写的输入框：使用者名称与资产状态，而其他选项则是可有可无。现在更新表单的 HTML 语法，使用 `required` 属性并标记提示在标籤中：

```html
<label for="user">Username (required)</label>
<input id="user" name="user" type="text" required>
...
<label for="currency">Currency (required)</label>
<input id="currency" name="currency" type="text" value="$" required>
```

伺服器并没设定输入框的文字上限，定义合理的文字输入上限是必要的。

在文字框内加入 `maxlength` 属性：

```html
<input id="user" name="user" type="text" maxlength="20" required>
...
<input id="currency" name="currency" type="text" value="$" maxlength="5" required>
...
<input id="description" name="description" type="text" maxlength="100">
```

现在，如果文字框并没有满足我们所定义的规则时，在点击了 *Register* 按钮后，你会看到：

![传输错误表单而出现验证失败的截图](../images/validation-error.png)

这类在传输资料给伺服器*之前*的验证系统称之为 **用户端(client-side)** 验证。但注意有些资料是没有办法在传输前被验证的。举例来说，我们没办法在发出请求前，确认是否已经存在著一组相同姓名的帐户。伺服器上额外的验证措施就称之为 **伺服器端(server-side)** 验证。

通常这两个验证都需要去编写，用户端验证能及时回馈给用户，提升使用者体验；伺服器端验证确保你要处理的用户资料是合理且安全的。

---

## 🚀 挑战

当相同使用者名称的帐户已经存在时，在 HTML 上显示错误讯息。

这边有做过一些造型的最终登入页面范本。

![加上 CSS 造型的登入页面截图](./images/result.png)

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/44?loc=zh_tw)

## 复习与自学

开发者在建立表单时需要发挥他们的创意，尤其是策画资料验证的规则。在 [CodePen](https://codepen.com) 上学习不同表单流程，你能发现什么有趣且令人发想的表单吗？

## 作业

[造型化你的银行程式](./assignment.zh-cn.md)
