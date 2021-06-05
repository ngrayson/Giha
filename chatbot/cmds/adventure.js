import { log } from '../../util/util.js'
import { getHeroById } from '../../Giha/heroManager.js'
import { newInstance } from '../../Giha/instanceManager.js'
import { newPrompt } from '../../Giha/promptManager.js'
import ResponseAction from '../ResponseAction.js'
import { getTestInstanceMap } from '../../db/InstanceMap.js'
import fs from 'fs'
import Discord from 'discord.js'
import Instance from '../../db/Instance.js'

let name = 'adventure'

export const help = {
  name: name,
  description: 'creates a new adventure instance',
  format: `!${name} @user1 @user2 @user3 @user4`,
  note: 'tag 0-4 people to join the party (0 will be solo)',
}

export const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false,
  },
}

export const run = async (bot, message, args) => {
  let msg = await message.channel.send('performing function...')

  // parse args and test them
  try {
    //look at all arguments
    //parse into individual users
    //make sure all users have active heroes
    //throw errors if any of those dont work
    //make a new instance and add all party members to the instance
    //display the instance
    //call Instance.render to display map and stats blob
    //react to own message with up left right down arrow keys
    //add message to list of bot messages that are being watched for reactions
    //
    let party = []
    let userHero = getHeroById(message.author.id)
    console.log(userHero)
    if (!userHero)
      throw `<@${message.author.id}> does not have a valid hero, please make a hero with !rise <name>`
    else party.push(userHero)

    if (args.length > 4) throw 'too many users tagged'
    args.forEach((tag) => {
      let discordId = tag.slice(3, tag.length - 1)
      let hero = getHeroById(discordId)
      if (!hero)
        throw `<@${discordId}> does not have a valid hero, please make a hero with !rise <name>`
      else party.push(hero)
    })
    // for (let usersTagged = 0; usersTagged < args.length; usersTagged++) {}

    let instance = newInstance()
    party.forEach((hero) => {
      instance.addPartyMember(hero)
    })

    let callback = () => {
      // do something like saying the dungeon has timed out idk
    }

    let prompt

    const moveUp = () => {
      console.log('move up!')
      instance.move('up')
      let coords = instance.partyCoordinates
      prompt.message.edit(`x:${coords.x} y:${coords.y}`)
      // prompt.refreshReactions()
    }
    const moveDown = () => {
      console.log('move down!')
      instance.move('down')
      let coords = instance.partyCoordinates
      prompt.message.edit(`x:${coords.x} y:${coords.y}`)
      // prompt.refreshReactions()
    }
    const moveRight = () => {
      console.log('move right!')
      instance.move('right')
      let coords = instance.partyCoordinates
      prompt.message.edit(`x:${coords.x} y:${coords.y}`)
      // prompt.refreshReactions()
    }
    const moveLeft = () => {
      console.log('move left!')
      instance.move('left')
      let coords = instance.partyCoordinates
      prompt.message.edit(`x:${coords.x} y:${coords.y}`)
      // prompt.refreshReactions()
    }

    let up = new ResponseAction('unicodeEmoji', '⬆️', moveUp)
    let down = new ResponseAction('unicodeEmoji', '⬇️', moveDown)
    let right = new ResponseAction('unicodeEmoji', '➡️', moveRight)
    let left = new ResponseAction('unicodeEmoji', '⬅️', moveLeft)

    let responseActions = []

    responseActions.push(left)
    responseActions.push(up)
    responseActions.push(down)
    responseActions.push(right)

    

    // render map
    const imgData = await instance.renderMap()
    fs.writeFile('./map.png', imgData, 'base64', (err) => {
      console.log(err)
    })
    const embed = new Discord.MessageEmbed()
      .attachFiles(['map.png'])
      .setImage('attachment://map.png')
    msg.delete()
    message.channel.send(embed)

    prompt = newPrompt(
      message.channel,
      'noLimit',
      responseActions,
      bot,
      "here's a prompt okay?",
      {},
      { time: 60000 },
      callback
    )

    // update reply and log it
    let txt = `created new instance with <@${message.author.id}> as the party leader`
    msg.edit(txt)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}
