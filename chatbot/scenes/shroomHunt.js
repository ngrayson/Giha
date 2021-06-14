import Discord from 'discord.js'
import emojiManager from '../emojiManager'
import ResponseAction from '../ResponseAction'
const shroomHuntScene = (promptCallback, sceneOptions) => {
  let shroomHunt = sceneOptions.shroomHunt
  const sceneInformation = {
    promptBehavior: 'oneClickPerUser', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: shroomHuntResponseActions(
      sceneOptions,
      promptCallback
    ), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: shroomHuntEmbed(shroomHunt), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 15000 }, // reaction collector options
    reactCollectorTimeoutCallback: expireCallback(shroomHunt, promptCallback), //what do you do when it all times out
  }
  return sceneInformation
}

const shroomHuntResponseActions = (sceneOptions, promptCallback) => {
  return () => {
    let shroomHunt = sceneOptions.shroomHunt
    let responseActions = []
    for (
      let mushroomIndex = 0;
      mushroomIndex < shroomHunt.mushrooms.length;
      mushroomIndex++
    ) {
      let mushroom = shroomHunt.mushrooms[mushroomIndex]
      // make a new responseAction
      // get the emoji
      let shroomEmoji = emojiManager.getEmojiByName(mushroom.emoji)
      let mushroomCallback = () => {
        shroomHunt.pick(mushroom)
        console.log(
          `hero picked ${mushroom.mushroomIndex} a ${mushroom.species} of quality ${mushroom.quality}, the score is now ${shroomHunt.score}`
        )
        promptCallback({ rerender: true })
      }
      let responseAction = new ResponseAction(
        'emoji',
        shroomEmoji,
        mushroomCallback
      )
      responseActions.push(responseAction)
    }
    return responseActions
  }
}

const shroomHuntEmbed = (shroomHunt) => {
  return () => {
    let txt
    if (shroomHunt.complete) {
      txt = `The shrooms have all burrowed.\nYour final score is: ${shroomHunt.score}`
    } else {
      txt = `Pick the mushrooms!\nscore: ${shroomHunt.score}`
    }
    let color
    if (shroomHunt.mushrooms[0].species == 'Mageroof') color = '#2D86F1'
    else color = '#000000'
    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('ShroomHunt')
      .addFields({ name: 'Foraging', value: txt })
    return embed
  }
}

const expireCallback = (shroomHunt, promptCallback) => {
  return () => {
    shroomHunt.burrow()
    promptCallback({
      rerender: true,
      reactions: 'clear',
    })
  }
}

export default shroomHuntScene
