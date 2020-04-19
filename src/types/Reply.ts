import * as discord from 'discord.js'

export namespace Reply {
  export type shape = 'string' | 'embed'

  export interface Data extends discord.MessageEmbedOptions {
    /** shape of the reply. Can be an Embed or a string **/
    shape?: shape
  }

  export interface Options {
    data?: Data
    msg: discord.Message
  }
}
