import { KeyPair, generateKeyPair, createKeyPair, bytesToBech32, Mnemonic, generateMnemonic, getPrivateKeyFromMnenomic, wordlistEnglish } from "npm:nostr-types"
import { parseArgs } from "jsr:@std/cli/parse-args"

const flags = parseArgs(Deno.args, {
  string: ["mnemonic"],
  alias: {
    "mnemonic": "m",
  }
})


const vanity = flags._[0]
const vanityLength = vanity?.length ?? 0

const mnemonicLength = flags.mnemonic !== undefined ? parseInt(flags.mnemonic) : undefined
const shouldGenerateMnemonic = mnemonicLength !== undefined

console.log(`Vanity: ${ vanity } (${ vanityLength })`)

// cli arg validations
if (vanityLength === 0) {
  console.error("Vanity cannot be empty")
  Deno.exit()
}

const bech32Regex = /^[023456789acdefghjklmnpqrstuvwxyz]+$/
if (bech32Regex.test(vanity) === false) {
  console.error("Vanity string contains non Bech32 characters")
  Deno.exit()
}

const mnemonicLengths = [12, 24]
if (shouldGenerateMnemonic && mnemonicLengths.includes(mnemonicLength) === false) {
  console.error("Invalid mnemonic length (not 12 or 24)")
  Deno.exit()
}

if (vanityLength > 5) {
  console.warn("This could take a while")
}

// search
console.log("⌛")

let matchedKeyPair: KeyPair
let matchedMnemonic: Mnemonic

while (matchedKeyPair === undefined) {

  let keyPair: KeyPair
  let mnemonic: Mnemonic
  if (shouldGenerateMnemonic) {
    mnemonic = generateMnemonic(wordlistEnglish, mnemonicLength)
    const privateKey = await getPrivateKeyFromMnenomic(mnemonic, wordlistEnglish)
    keyPair = await createKeyPair(privateKey)
  } else {
    keyPair = await generateKeyPair()
  }

  const npub = bytesToBech32(keyPair.publicKey, "npub")
  const s = npub.substr(5, vanityLength)

  if (s === vanity) {
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
npub: ${ npub }
nsec: ${ nsec }
mnemonic: ${ shouldGenerateMnemonic ? matchedMnemonic.join(" ") : "-" }
`)