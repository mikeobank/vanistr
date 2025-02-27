import { parseArgs } from "jsr:@std/cli/parse-args"
import {
  type MnemonicLength,
  generateMnemonic,
  wordlistEnglish
} from "npm:nostr-types"
import { createXPub } from "../lib/createXPub.ts"

const flags = parseArgs(Deno.args, {
  string: ["mnemonic"],
  alias: {
    "mnemonic": "m",
  }
})

const mnemonicLength: MnemonicLength = flags.mnemonic === "24" ? 24 : 12

const mnemonic = generateMnemonic(wordlistEnglish, mnemonicLength)
const xpub = await createXPub(mnemonic)

console.log(`mnemonic: ${ mnemonic }`)
console.log(`xpub: ${ xpub }`)
