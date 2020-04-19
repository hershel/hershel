import * as discord from 'discord.js'
import ow from 'ow'

import { Reply } from '../types/Reply'

class Reply extends discord.MessageEmbed {
  private _response: discord.Message = null
  private _shape: Reply.shape = 'embed'
  private _message: discord.Message
  private _is_sent: boolean = false

  constructor({ data, msg }: Reply.Options) {
    super(data)

    if (data.shape) this.setShape(data.shape)

    this._message = msg
  }

  public setMessage = this.setDescription

  /**
   * Set reply shape
   * @param type reply shape ('string' or 'embed')
   */
  public setShape(type: Reply.shape) {
    ow(type, ow.string.oneOf(['string', 'embed']))
    this._shape = type

    return this
  }

  /**
   * Send reply
   * @param options message options
   */
  public async send(options?: discord.MessageOptions) {
    if (this._is_sent) throw new Error('Cannot send reply twice. Use `update`')

    const payload = this.payload()
    if (!payload) {
      throw new Error('Cannot send reply while its payload is empty')
    }

    this._is_sent = true

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
    if (!this._is_sent) {
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
    return this._shape === 'embed'
      ? new discord.MessageEmbed(this)
      : this.description
  }

  /**
   * Reset reply
   * @param data properties to set
   */
  public reset(data: discord.MessageEmbedOptions = {}) {
    // @ts-ignore
    this.setup(data)
  }

  /**
   * Shape of the reply. Can be 'string' or 'embed'.
   */
  get shape() {
    return this._shape
  }

  /**
   * If the reply is already sent
   */
  get is_sent() {
    return this._is_sent
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
