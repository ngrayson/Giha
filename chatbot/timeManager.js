// get something idk
import { getHeroes } from '../Giha/heroManager.js'

const STAMINA_TICK_RATE = 40 //how many ms between stamina ticks
// const CRAFTING_TICK_RATE = 100000 // how many ms between crafting ticks
let lastStamUpdate
// let lastCraftingUpdate = new Date()

setInterval(() => {
  updateTimeEvents()
}, 2000)

const init = () => {
  lastStamUpdate = new Date()
}

export default init

const updateTimeEvents = () => {
  let now = new Date()
  let stamTimeElapsed = now - lastStamUpdate
  if (stamTimeElapsed > STAMINA_TICK_RATE) {
    // time to update stamina
    let numTicks = Math.floor(stamTimeElapsed / STAMINA_TICK_RATE)
    globalIncreaseStam(numTicks)
    let leftovers = stamTimeElapsed % STAMINA_TICK_RATE
    lastStamUpdate = now - leftovers
  }
}

const globalIncreaseStam = () => {
  // to do
  let heroes = getHeroes()
  for (let i = 0; i < heroes.length; i++) {
    heroes[i].increaseStamina()
  }
}
