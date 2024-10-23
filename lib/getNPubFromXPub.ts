import { type Npub, createNpub } from "npm:nostr-types"
import { HDKey } from "npm:@scure/bip32"
import { type XPub } from "./createXPub.ts"

export const getNPubFromXPub = (xPub: XPub, index: number) : Npub => {
  const hdKey = HDKey.fromExtendedKey(xPub)
  const childKey = hdKey.deriveChild(0).deriveChild(index)
  const pubKey = childKey.publicKey
  if (pubKey == null) throw new Error("Could not derive public key from XPub")
  // Remove prepended version number from publicKey
  return createNpub(pubKey.slice(1))
}