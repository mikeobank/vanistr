import { areBech32Chars, Npub } from "npm:nostr-types"
import { parseArgs } from "jsr:@std/cli/parse-args"
import { getNPubFromXPub } from "./lib/getNPubFromXPub.ts";

const flags = parseArgs(Deno.args, {
  string: ["xpub", "index"],
  boolean: ["log"],
  default: { log: false }
})

const vanity = flags._[0] !== undefined ? String(flags._[0]) : ""
const vanityLength = vanity.length ?? 0

console.log(`Vanity: ${ vanity } (${ vanityLength })`)
console.log(`XPub: ${ flags.xpub ?? "-"}`)

// cli arg validations
if (flags.xpub === undefined) {
  console.error("XPub can not be undefined")
  Deno.exit()
}

if (vanityLength === 0) {
  console.error("Vanity cannot be empty")
  Deno.exit()
}

if (areBech32Chars(vanity) === false) {
  console.error("Vanity string contains non Bech32 characters")
  Deno.exit()
}

let index: number = flags.index !== undefined ? parseInt(flags.index, 10) : 0
let matched = false
let npub: Npub

while (matched === false && index < (0x80000000 - 1)) {

  npub = getNPubFromXPub(flags.xpub, index)
  const s = npub.substring(5, 5 + vanityLength)
  if (s === vanity) {
    matched = true
  } else {
    index++
  }
  if (flags.log && index % 1024 === 0) {
    console.log(index)
  }
}

if (matched) {
  console.log(`
  Found!
  ======
  npub: ${ npub! }
  index: ${ index }
  `)
} else {
  console.log("No match found")
}


