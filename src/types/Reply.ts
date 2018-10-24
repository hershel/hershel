import * as discord from 'discord.js'

export namespace Reply {
  export type type = 'string' | 'embed'

  export interface Data extends discord.RichEmbedOptions {
    type?: type
  }

  export interface Options {
    data?: Data
    msg: discord.Message
  }
}
