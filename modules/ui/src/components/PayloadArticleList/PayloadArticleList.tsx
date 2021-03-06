import React, { FunctionComponent, useMemo } from "react";
import css from "./PayloadArticleList.cssProxy";
import { PayloadArticleListItem } from "./PayloadArticleList.Item";
import { AppActions, AlgolListingContainer } from "../../../../types";
import compositeId from "../../../../payloads/dist/compositeId";

export type PayloadArticleListProps = {
  actions: AppActions;
  reverse?: boolean;
  list: AlgolListingContainer;
};

export const PayloadArticleList: FunctionComponent<PayloadArticleListProps> = props => {
  let { actions, list, reverse } = props;
  const listToRender = useMemo(() => {
    const ret = list.listings
      .slice()
      .filter(l => !l.hidden)
      .sort((i1, i2) => (i1.sort < i2.sort ? -1 : 1));
    if (reverse) ret.reverse();
    return ret;
  }, [list]);
  return (
    <div className={css.payloadArticleList}>
      {listToRender.map(listing => (
        <PayloadArticleListItem
          key={listing.url}
          actions={actions}
          listing={listing}
          compositeName={list.composite.replace(
            ".png",
            "_" + compositeId + ".png"
          )}
        />
      ))}
    </div>
  );
};
