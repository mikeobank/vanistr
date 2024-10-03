import { generateKeyPair, KeyPair, bytesToBech32 } from "npm:nostr-types"

const vanity = Deno.args[0]
const vanityLength = vanity?.length ?? 0

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

if (vanityLength > 5) {
  console.warn("This could take a while")
}

// search
console.log("⌛")

let matchedKeyPair: KeyPair

while (matchedKeyPair === undefined) {

  const keyPair = await generateKeyPair()
  const npub = bytesToBech32(keyPair.publicKey, "npub")
  const s = npub.substr(5, vanityLength)

  if (s === vanity) {
    matchedKeyPair = keyPair
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
`)