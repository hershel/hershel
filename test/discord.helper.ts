import { Message, User } from 'discord.js'

interface CreateMessage extends Pick<Message, 'content' | 'id' | 'author'> {
  [key: string]: any
}

// @ts-ignore
const defaultMessage: CreateMessageTypes = {
  id: Date.now().toString(),
  content: 'hello world',
  author: {
    tag: 'HelloWorld#0001'
  },
  channel: { send: () => {} },
  edit: () => {}
}

export const createMessage = (items?: Partial<CreateMessage>) => ({
  ...defaultMessage,
  ...items
})
