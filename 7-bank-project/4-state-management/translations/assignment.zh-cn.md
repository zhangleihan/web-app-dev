# 编写"加入交易明细"视窗

## 简介

我们的银行应用程式还缺乏一项重要的功能：输入新的交易明细。
使用你在这四堂课中学到的知识，编写"加入交易明细"视窗：

- 在仪表板页面新增"加入交易明细"按钮
- 加入新的 HTML 模板建立新页面，或是在同一页面中使用 JavaScript 显示 HTML 窗格(可以使用 [`hidden`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/hidden) 属性，或是 CSS classes)
- 确保视窗能满足[键盘与萤幕报读器的相容性](https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/)
- 编写 HTML 表单来接收输入资料
- 建立 JSON 表单资料并传送到 API 上
- 使用新资料更新到仪表板页面上

看看[伺服器 API 规格](../api/README.zh-cn.md)来查询你需要呼叫的 API 和所需的 JSON 格式。

这边有完成作业后的成果：

!["加入交易明细"视窗的例子截图](./images/dialog.png)

## 学习评量

| 作业内容 | 优良                                 | 普通                                               | 待改进                 |
| -------- | ------------------------------------ | -------------------------------------------------- | ---------------------- |
|          | 利用课程内容完美的制作出交易明细功能 | 有制作出交易明细功能，但有缺少部分要点且功能不完全 | 新的交易明细功能不正常 |
