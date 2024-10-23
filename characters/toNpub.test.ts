import { assertEquals } from "jsr:@std/assert"
import { toNpub } from "./toNpub.ts"

Deno.test("toNpub", () => {
  const npub = toNpub("npub1ZUTzeysacnf9rru6zqwmxd54mud_k44tst6l7Oja5mhv8Jjumytsd2x7nu")
  assertEquals(npub, "npub1zutzeysacnf9rru6zqwmxd54mud0k44tst6l70ja5mhv8jjumytsd2x7nu")
})