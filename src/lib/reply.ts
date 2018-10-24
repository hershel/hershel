import * as discord from 'discord.js'
import ow from 'ow'

import { Reply } from '../types/Reply'

class Reply extends discord.RichEmbed {
  private _response: discord.Message = null
  private _type: Reply.type = 'embed'
  private _message: discord.Message
  private _sent: boolean = false

  constructor({ data, msg }: Reply.Options) {
    super(data)

    if (data.type) this.setType(data.type)

    this._message = msg
  }

  public setMessage = this.setDescription

  /**
   * Set reply type
   * @param type reply type (string or embed)
   */
  public setType(type: Reply.type) {
    ow(type, ow.string.oneOf(['string', 'embed']))
    this._type = type

    return this
  }

  /**
   * Send reply
   * @param options message options
   */
  public async send(options?: discord.MessageOptions) {
    if (this._sent) throw new Error('Cannot send reply twice. Use `update`')

    const payload = this.payload()
    if (!payload) {
      throw new Error('Cannot send reply while its payload is empty')
    }

    this._sent = true

    this._response = (await this._message.channel.send(
      payload,
      options
    )) as discord.Message

    return this._response
  }

  /**
   * Update response
   * @param options message edit options
   */
  public async update(options?: discord.MessageEditOptions) {
    if (!this._sent) {
      throw new Error('Cannot update unsent message. Use `.send()`')
    }

    const payload = this.payload()
    if (!payload) {
      throw new Error('Cannot update reply while its payload is empty')
    }

    return this._response.edit(payload, options)
  }

  /**
   * Get message payload
   */
  public payload() {
    const type = this._type
    return type === 'embed' ? new discord.RichEmbed(this) : this.description
  }

  /**
   * Reset reply
   * @param data properties to set
   */
  public reset(data: discord.RichEmbedOptions = {}) {
    this.title = data.title
    this.description = data.description
    this.url = data.url
    this.color = data.color as number
    this.author = data.author
    this.timestamp = data.timestamp
    this.fields = data.fields || []
    this.thumbnail = data.thumbnail
    this.image = data.image
    this.footer = data.footer
    this.file = data.file
  }

  get type() {
    return this._type
  }

  get sent() {
    return this._sent
  }

  get response() {
    return this._response
  }

  get message() {
    return this._message
  }
}

export { Reply }

export const createReplyFactory = (data?: Reply.Data) => (
  msg: discord.Message
) => (override?: Reply.Data) =>
  new Reply({ data: { ...data, ...override }, msg })
