import { type Npub, isNpub } from "npm:nostr-types"

const txt = await Deno.readTextFile("./characters/characters.txt") 
const lines = txt.split("\n")
const regexes: [RegExp, string][] = lines.map(line => {
  const [char, chars = ""] = line.split(" ")
  return [new RegExp(`[${ chars }]`, "g"), char]
})

export const toBech32 = (str: string) : string => {
  return regexes.reduce((acc, cur) => {
    const [regex, char] = cur
    return acc.replace(regex, char)
  }, str)
}

export const toNpub = (str: string) : Npub => {

  const bech32 = toBech32(str.replace(/^npub1/, ""))
  console.log(bech32)
  const npub = `npub1${ bech32 }`

  if (isNpub(npub)) {
    return npub
  } else {
    throw new Error("Could not map str to npub")
  }
}