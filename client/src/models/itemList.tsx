import { types } from 'mobx-state-tree';
import Message from './message';
const ItemList = types
  .model('ItemList', {
    items: types.array(Message),
  })
  .actions((self) => ({
    add(message: typeof Message.Type): void {
      self.items.push(message);
    },
    pop(): void {
      self.items.shift();
    },

    empty(): boolean {
      return self.items.length === 0;
    },
    getLen(): number {
      return self.items.length;
    },
  }));

export default ItemList;
