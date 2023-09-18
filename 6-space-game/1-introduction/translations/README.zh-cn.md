# 建立太空游戏 Part 1：简介

![影片](../../images/pewpew.gif)

## 课前测验

[课前测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/29?loc=zh_tw)

### 游戏开发中的继承(Inheritance)与组合(Composition)

在之前的课程中，因为专案较小的规模，我们不需要去担忧应用程式的设计结构。然而，当你的应用程式规模越来越大时，结构的选择就是一大课题。在 JavaScript 中，有两种大方向来建立庞大的应用程式：*组合(Composition)*与*继承(Inheritance)*。它们有各自的优缺点，我们会借由游戏内容来进行说明。

✅ 其中一本有名的程式设计用书是有关于[设计模式](https://zh.wikipedia.org/wiki/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%8F%AF%E5%A4%8D%E7%94%A8%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%BD%AF%E4%BB%B6%E7%9A%84%E5%9F%BA%E7%A1%80)。

在游戏中你会有`游戏物件`，显示在画面中。这代表它们在笛卡尔座标系中有各自的位置，以 `x` 与 `y` 座标点定义。当你在开发游戏时，你会注意到所有的游戏物件都有一套标准的规范，和大多数的游戏相似，通常会有这些元素：

- **适地性** 大多数游戏元素都是建立在位置上的。这代表他们有各自的所在处，一组 `x` 与 `y`。
- **可移动的** 这些物件可以移动到新的位置。典型来说有英雄、怪物或是 NPC(Non Player Character)，但有些例外，好比是树这种常驻物件。
- **可自毁的** 这些物件只能存在于一小段时间，接著它们就会自我删除。通常这是`死亡`或是`被摧毁`的布林讯号传递给游戏引擎，告知物件不再需要被描绘出来。
- **冷却时间** 「冷却时间」是存活周期短的典型物件属性。好比是一段文字、爆炸的视觉特效，只能呈现数毫秒的时间。

✅ 想想看游戏小精灵(Pac-Man)。你能辨别出符合上述清单的其中四种物件吗？

### 行为表达

以上的叙述皆在表达游戏物件所进行的行为。那我们该如何去编写它们呢？我们可以使用方法(methods)连接 classes 或是物件(objects)来表达这些行为。

**Classes**

这个想法是结合 `classes` 与`继承`的方式来在 class 中添加特定行为。

✅ 继承是一个重要概念。在[有关继承的 MDN 文章中](https://developer.mozilla.org/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)学习更多内容。

以程式码来表达的话，一个游戏物件通常会呈现这种形式：

```javascript

//设定 class GameObject
class GameObject {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

//这个 class 会继承 GameObject 中 class 内容
class Movable extends GameObject {
  constructor(x,y, type) {
    super(x,y, type)
  }

//这个可移动物件可以在画面上移动
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

//这是特定的 class 继承 Movable class，它能使用所有继承到的属性内容
class Hero extends Movable {
  constructor(x,y) {
    super(x,y, 'Hero')
  }
}

//另一方面，这个 class 只继承到 GameObject 的内容
class Tree extends GameObject {
  constructor(x,y) {
    super(x,y, 'Tree')
  }
}

//英雄可以移动......
const hero = new Hero();
hero.moveTo(5,5);

//但树木却不能
const tree = new Tree();
```

✅ 花点时间重新构思小精灵(Pac-Man)的主角，或是 Inky、Pinky 与 Blinky 这几只鬼魂。它们该如何以 JavaScript 表现？

**组合**

另一种处理物件继承的方式为*组合(Composition)*。物件以这种方式呈现它们的行为：

```javascript
//建立常数 gameObject
const gameObject = {
  x: 0,
  y: 0,
  type: ''
};

//...与常数 movable
const movable = {
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}
//常数 movableObject 是 gameObject 与 movable 的组合
const movableObject = {...gameObject, ...movable};

//利用函式建立新的英雄，继承 movableObject 的内容
function createHero(x, y) {
  return {
    ...movableObject,
    x,
    y,
    type: 'Hero'
  }
}
//...与常驻物件只继承 gameObject 的属性
function createStatic(x, y, type) {
  return {
    ...gameObject
    x,
    y,
    type
  }
}
//建立可以移动的英雄
const hero = createHero(10,10);
hero.moveTo(5,5);
//和建立只能伫立于此的树木
const tree = createStatic(0,0, 'Tree'); 
```

**我该使用哪一种设计模式？**

这都取决于你选择何种设计模式。JavaScript 支援这两种范例。

--

另一种在游戏开发中常见的设计模式负责处理玩家的游戏表现与游戏体验。

## 发布订阅设计模式

✅ Pub/Sub 全名为 'publish-subscribe'

这个设计模式将应用程式内不同的模组分开处理，让彼此不知道彼此的行为。为何要这样做？这让我们总观上更轻易地了解各个模组的行为。也可以在你想要时轻易地改变模组的行为模式。我们该如何实践它呢？我们先建立这几个概念：

- **讯息**： 一个讯息通常会以文字字串与额外的负载(payload) ── 一组定义讯息内容的资料 ── 呈现。游戏中典型的讯息可以是 `KEY_PRESSED_ENTER`。
- **发布者**： 这个元素*发布*讯息给所有的订阅者。
- **订阅者**： 这个元素*监听*特定的讯息，并借由执行某些任务以作为讯息的回应，例如发射雷射光。

实践方法虽小，但这是功能强大的设计方式。这是它的建立方式：

```javascript
//设定 EventEmitter class 容纳监听者
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
//当讯息接收时，让监听者处理它的负载
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
//当讯息发出时，附上负载发给监听者
  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach(l => l(message, payload))
    }
  }
}

```

利用上述程式我们建立一套小型实作内容：

```javascript
//设定讯息种类
const Messages = {
  HERO_MOVE_LEFT: 'HERO_MOVE_LEFT'
};
//调用你设定的 eventEmitter
const eventEmitter = new EventEmitter();
//设定英雄
const hero = createHero(0,0);
//让 eventEmitter 监听有关英雄往左移的讯息，并执行动作
eventEmitter.on(Messages.HERO_MOVE_LEFT, () => {
  hero.move(5,0);
});

//设定游戏视窗来监听键盘事件，当左方向键按压时，发出英雄往左移的讯息
window.addEventListener('keyup', (evt) => {
  if (evt.key === 'ArrowLeft') {
    eventEmitter.emit(Messages.HERO_MOVE_LEFT)
  }
});
```

我们连接了键盘事件 `ArrowLeft` 并传递 `HERO_MOVE_LEFT` 讯息。我们监听该讯息并移动 `hero` 作为结果。这种开发方式让事件监听者与英雄区隔开来。你也可以将 `ArrowLeft` 换成 `A` 键。此外，我们能修改 eventEmitter 的 on 函式，让 `ArrowLeft` 事件产生截然不同的行为。

```javascript
eventEmitter.on(Messages.HERO_MOVE_LEFT, () => {
  hero.move(5,0);
});
```

当游戏越来越丰富、物件越来越复杂时，这套设计方式能维持程式码的整洁。由衷建议善用这套设计模式。

---

## 🚀 挑战

想想看发布订阅模式可以如何增进一款游戏。哪一个部份该发送事件，而游戏又该如何回应事件？现在你有机会发挥你的创意，思考一款新游戏和它运作的模组。

## 课后测验

[课后测验](https://ashy-river-0debb7803.1.azurestaticapps.net/quiz/30?loc=zh_tw)

## 复习与自学

借由[阅读此连结](https://docs.microsoft.com/azure/architecture/patterns/publisher-subscriber/?WT.mc_id=academic-77807-sagibbon)来认识更多关于发布与订阅的设计模式。

## 作业

[建立游戏雏形](assignment.zh-cn.md)
