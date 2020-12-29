// bring a test discord bot online
import Discord from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TEST_DBOT_TOKEN

const bot = new Discord.Client({})

const run = () => {
  bot.on('ready', () => {
    console.log(
      '\x1b[32m' +
        ' ✓' +
        '\x1b[0m' +
        ' Test Bot logged in under ' +
        '\x1b[7m' +
        bot.user.tag +
        '\x1b[0m'
    )
    bot.on('message', async (msg) => {
      parseTestMessage(msg)
    })
  })

  console.log(token)
  bot
    .login(token)
    .then(console.log('  Test bot logging in...', true))
    .catch(console.error)
}

const parseTestMessage = (message) => {
  console.log(message.content)
  return false
}

run()
// bring the regular discord bot online
// run all end to end tests
// put both bots offline
// display results
