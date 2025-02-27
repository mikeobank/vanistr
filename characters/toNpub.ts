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
  const npub = `npub1${ bech32 }`

  if (isNpub(npub)) {
    return npub
  } else {
    throw new Error("Could not map str to npub")
  }
}

export const toVanityPub = (npub: Npub, vanity: string) : string => {
  const start = 5
  const end = start + vanity.length
  const s = npub.substring(start, end)
  if (toBech32(vanity) !== s) {
    throw new Error(`${ vanity } does not map to npub: ${ npub }`)
  }
  return `npub1${ vanity }${ npub.substring(end) }`
}