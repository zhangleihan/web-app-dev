const jokes = require("give-me-a-joke");
const colors = require("colors");

jokes.getRandomDadJoke(function (joke) {
    console.log(joke);
    console.log(colors.rainbow(joke));
});
