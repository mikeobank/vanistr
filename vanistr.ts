import { 
  type KeyPair, 
  type Mnemonic, 
  type MnemonicLength, 
  generateKeyPair, 
  createKeyPair, 
  bytesToBech32, 
  areBech32Chars, 
  generateMnemonic, 
  getPrivateKeyFromMnenomic, 
  wordlistEnglish, 
  isMnemonicLength 
} from "npm:nostr-types"
import { parseArgs } from "jsr:@std/cli/parse-args"
import { toBech32, toVanityPub } from "./characters/toNpub.ts"

const flags = parseArgs(Deno.args, {
  string: ["mnemonic"],
  alias: {
    "mnemonic": "m",
  }
})

const vanity = flags._[0] !== undefined ? String(flags._[0]) : ""
const vanityLength = vanity.length ?? 0
const search = toBech32(vanity)

const mnemonicLengthNum = flags.mnemonic !== undefined ? parseInt(flags.mnemonic, 10) : undefined
let shouldGenerateMnemonic = false
let mnemonicLength: MnemonicLength | undefined

console.log(`Vanity: ${ vanity } (${ vanityLength })`)

// cli arg validations
if (vanityLength === 0) {
  console.error("Vanity cannot be empty")
  Deno.exit()
}

if (areBech32Chars(search) === false) {
  console.error("Vanity string contains illegal characters")
  Deno.exit()
}

if (mnemonicLengthNum !== undefined) {
  if (isMnemonicLength(mnemonicLengthNum)) {
    mnemonicLength = mnemonicLengthNum
    shouldGenerateMnemonic = true
  } else {
    console.error("Invalid mnemonic length (not 12 or 24)")
    Deno.exit()
  }
}

if (vanityLength > 5) {
  console.warn("This could take a while")
}

// search
console.log("⌛")

let matchedKeyPair: KeyPair | undefined
let matchedMnemonic: Mnemonic | undefined

while (matchedKeyPair === undefined) {

  let keyPair: KeyPair
  let mnemonic: Mnemonic | undefined
  if (shouldGenerateMnemonic) {
    mnemonic = generateMnemonic(wordlistEnglish, mnemonicLength)
    const privateKey = await getPrivateKeyFromMnenomic(mnemonic, wordlistEnglish)
    keyPair = createKeyPair(privateKey)
  } else {
    keyPair = generateKeyPair()
  }

  const npub = bytesToBech32(keyPair.publicKey, "npub")
  const s = npub.substring(5, 5 + vanityLength)

  if (s === search) {
    matchedKeyPair = keyPair
    if (shouldGenerateMnemonic) {
      matchedMnemonic = mnemonic
    }
  }
}

// output 

const npub = bytesToBech32(matchedKeyPair.publicKey, "npub")
const nsec = bytesToBech32(matchedKeyPair.privateKey, "nsec")

console.log(`
Found!
======
vanity: ${ toVanityPub(npub, vanity) }
npub: ${ npub }
nsec: ${ nsec }
mnemonic: ${ shouldGenerateMnemonic ? matchedMnemonic?.join(" ") : "-" }
`)