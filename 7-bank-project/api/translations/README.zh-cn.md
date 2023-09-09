# 银行 API (Bank API)

> 由 [Node.js](https://nodejs.org) 与 [Express](https://expressjs.com/) 建立而成。

这套 API 已经建好而不在本次课程的范畴内。

然而，如果你想学习如何建立 API，你可以追踪这一系列的影片：https://aka.ms/NodeBeginner (影片 17 到 21 为这套 API)。

你也可以看看这套互动式教学： https://aka.ms/learn/express-api

## 运行伺服器

确保你的 [Node.js](https://nodejs.org) 已经安装完成。

1. Git clone 这个数据库.
2. 在资料夹 `api` 中开启终端机，执行 `npm install`。
3. 执行 `npm start`。

伺服器应该要在连接埠 `5000` 上监听讯息。

> 笔记：所有储存的资料不是永久保存的，伺服器终止时会遗失所有资料。

## API 项目

路由                                         | 描述
---------------------------------------------|------------------------------------
GET    /api/                                 | 取得伺服器资讯
POST   /api/accounts/                        | 建立新的帐户，范例： `{ user: 'Yohan', description: 'My budget', currency: 'EUR', balance: 100 }`
GET    /api/accounts/:user                   | 取得特定帐户的所有资料
DELETE /api/accounts/:user                   | 移除特定帐户
POST   /api/accounts/:user/transactions      | 建立新的交易明细，范例： `{ date: '2020-07-23T18:25:43.511Z', object: 'Bought a book', amount: -20 }`
DELETE  /api/accounts/:user/transactions/:id | 移除特定交易明细

