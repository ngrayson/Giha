const getEmojiByName = (bot, emojiName) => {
  let searchRes = bot.emojis.find((emoji) => emoji.name === emojiName)
  if (!searchRes) throw `no emoji named ${emojiName}`
  return searchRes
}
export { getEmojiByName }
