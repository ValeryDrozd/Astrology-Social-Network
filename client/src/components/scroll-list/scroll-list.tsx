import { useEffect, useState } from 'react';

interface ScrollListProps {
  list: unknown[];
  renderItem: (value: unknown, index: number, array: unknown[]) => JSX.Element;
  numberOfVisibleItems: number;
  wrap: (
    itemList: JSX.Element[],
    onWheel: (i: React.WheelEvent<HTMLUListElement>) => void,
  ) => JSX.Element;
  startBottom?: boolean;
  loadMore?: () => void;
}

export default function ScrollList({
  list,
  renderItem,
  wrap,
  numberOfVisibleItems,
  startBottom,
  loadMore,
}: ScrollListProps): JSX.Element {
  const getStartTopItem = (): number => {
    let startTopItem = 0;
    if (startBottom && list.length > numberOfVisibleItems) {
      startTopItem = list.length - numberOfVisibleItems;
    }
    return startTopItem;
  };

  const [topItem, setTopItem] = useState<number>(getStartTopItem());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    console.log(list.length);
    setTopItem(getStartTopItem());
  }, [list.length]);

  const startIndex = topItem;
  const endIndex =
    topItem + numberOfVisibleItems > list.length - 1
      ? list.length
      : topItem + numberOfVisibleItems;
  const visualList = list.slice(startIndex, endIndex);

  const showList = visualList.map(renderItem);
  const onWheel = ({ deltaY }: React.WheelEvent<HTMLUListElement>): void => {
    if (list.length <= numberOfVisibleItems || scrolled) return;
    if (deltaY > 15) {
      setTopItem(
        topItem >= list.length - numberOfVisibleItems
          ? list.length - numberOfVisibleItems
          : topItem + 1,
      );
    } else if (deltaY < -15) {
      console.log(list.length);
      const newTopItem = topItem <= 0 ? 0 : topItem - 1;
      console.log(newTopItem);
      setTopItem(newTopItem);
      if (newTopItem < 5) {
        loadMore?.();
      }
    }
    setScrolled(true);
    setTimeout(() => setScrolled(false), 15);
  };
  return wrap(showList, onWheel);
}
