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
}: ScrollListProps): JSX.Element {
  let startTopItem = 0;
  if (startBottom && list.length > numberOfVisibleItems) {
    startTopItem = list.length - 1 - numberOfVisibleItems;
  }
  const [topItem, setTopItem] = useState<number>(startTopItem);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTopItem(startTopItem);
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
      setTopItem(topItem <= 0 ? 0 : topItem - 1);
    }
    setScrolled(true);
    setTimeout(() => setScrolled(false), 15);
  };
  return wrap(showList, onWheel);
}
