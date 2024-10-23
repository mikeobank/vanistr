import { type Mnemonic, isMnemonic, mnemonicToString, wordlistEnglish as wordlist } from "npm:nostr-types"
import { HDKey } from "npm:@scure/bip32"
import { mnemonicToSeed } from "npm:@scure/bip39"

export type XPub = string

export const createXPub = async (mnemonic: Mnemonic) : Promise<XPub> => {
  if (isMnemonic(mnemonic, wordlist) === false) throw new Error("Invalid mnemonic")
  const seed = await mnemonicToSeed(mnemonicToString(mnemonic))
  const hdKey = HDKey.fromMasterSeed(seed)
  const path = "m/44'/1237'/0'"
  const derivedHDKey = hdKey.derive(path)
  return derivedHDKey.publicExtendedKey
}