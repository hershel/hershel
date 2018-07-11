import * as discord from 'discord.js'

export namespace Reply {
  export type Type = 'string' | 'embed'

  export interface Options {
    data?: discord.RichEmbedOptions
    msg: discord.Message
  }
}
