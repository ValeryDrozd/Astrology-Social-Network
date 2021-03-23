import { types } from 'mobx-state-tree';

const Message = types
  .model('Message', {
    chatId: types.integer,
    text: types.string,
    time: types.Date,
    isSent: false,
  })
  .actions((self) => ({
    send(): void {
      self.isSent = true;
    },
  }))
  .views((self) => ({
    status(): boolean {
      return self.isSent;
    },
  }));

export default Message;
