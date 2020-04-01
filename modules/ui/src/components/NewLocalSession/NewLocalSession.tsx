import React, { FunctionComponent } from "react";
import css from "./NewLocalSession.cssProxy";
import {
  AlgolLocalBattle,
  AlgolGameGraphics,
  AlgolMeta,
  AlgolErrorReporter,
  AlgolGameBlobAnon,
  AlgolVariantAnon,
} from "../../../../types";
import { Button } from "../Button";
import { SessionList } from "../SessionList";
import { ImportBattle } from "../ImportBattle";
import { VariantSelector } from "./NewLocalSession.VariantSelector";

export interface NewLocalSessionActions {
  newLocalBattle: (code: string) => void;
  loadLocalSession: (session: AlgolLocalBattle) => void;
  importSession: (str: string) => void;
  continuePreviousSession: () => void;
  reportError: AlgolErrorReporter;
}

type NewLocalSessionProps = {
  graphics: AlgolGameGraphics;
  actions: NewLocalSessionActions;
  hasPrevious: boolean;
  meta: AlgolMeta<AlgolGameBlobAnon>;
  variants: AlgolVariantAnon[];
};

export const NewLocalSession: FunctionComponent<NewLocalSessionProps> = props => {
  const { actions, meta, graphics, hasPrevious, variants } = props;
  return (
    <div className={css.newLocalSession}>
      <VariantSelector variants={variants} actions={actions} />
      <div className={css.newLocalSessionDivider} />
      <Button
        disabled={!hasPrevious && "No previous battle found for this game."}
        onClick={actions.continuePreviousSession}
        controlId="continue-previous-battle"
        onError={actions.reportError}
      >
        Load last battle
      </Button>
      <div className={css.newLocalSessionDivider} />
      <Button disabled="AI is in the works, but remote play will be implemented first.">
        Versus AI
      </Button>
      <div className={css.newLocalSessionDivider} />
      <ImportBattle actions={actions} />
      <div className={css.newLocalSessionDivider} />
      <SessionList
        meta={meta}
        graphics={graphics}
        actions={actions}
        variants={variants}
      />
    </div>
  );
};