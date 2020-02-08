import React, { FunctionComponent, useMemo, Fragment } from "react";
import styles from "./GameLanding.cssProxy";
import {
  AlgolMeta,
  AlgolLocalBattle,
  AlgolGameGraphics,
  AlgolErrorReporter,
} from "../../../../types";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { LocalSession, LocalSessionActions } from "../LocalSession";
import { useModal } from "../../helpers";
import { ButtonGroup } from "../ButtonGroup";
import { Markdown } from "../Markdown";

export interface GameLandingActions {
  newLocalBattle: () => void;
  loadLocalSession: (session: AlgolLocalBattle) => void;
  navTo: (path: string) => void;
  toBattleLobby: () => void;
  importSession: (str: string) => void;
  continuePreviousSession: () => void;
  reportError: AlgolErrorReporter;
}

type GameLandingHTML = {
  about: string;
  rules: string;
};

type GameLandingProps = {
  meta: AlgolMeta<string, string>;
  actions: GameLandingActions;
  graphics: AlgolGameGraphics;
  hasPrevious: boolean;
  html: GameLandingHTML;
};

export const GameLanding: FunctionComponent<GameLandingProps> = props => {
  const { meta, actions, graphics, hasPrevious, html } = props;
  const [isSessionModalOpen, openSessionModal, closeSessionModal] = useModal();
  const [isRulesModalOpen, openRulesModal, closeRulesModal] = useModal();
  const [isAboutModalOpen, openAboutModal, closeAboutModal] = useModal();

  // hack actions to close game modal when chosen a game
  const localSessionActions = useMemo(
    (): LocalSessionActions => ({
      loadLocalSession: (session: AlgolLocalBattle) => {
        actions.loadLocalSession(session);
        closeSessionModal();
      },
      newLocalBattle: () => {
        actions.newLocalBattle();
        closeSessionModal();
      },
      importSession: (str: string) => {
        actions.importSession(str);
        closeSessionModal();
      },
      continuePreviousSession: () => {
        closeSessionModal();
        actions.continuePreviousSession();
      },
      reportError: actions.reportError,
    }),
    []
  );
  return (
    <Fragment>
      <div className={styles.gameLandingQuote}>{meta.tagline}</div>
      <ButtonGroup>
        <Button big onClick={openSessionModal}>
          Local
        </Button>
        <Button disabled="Online play will come in a future version!">
          Remote
        </Button>
        <Button disabled={isAboutModalOpen} onClick={openAboutModal}>
          About
        </Button>
        <Button onClick={openRulesModal}>Rules</Button>
      </ButtonGroup>
      <Modal
        isOpen={isSessionModalOpen}
        onClose={closeSessionModal}
        title="Play locally"
      >
        <LocalSession
          actions={localSessionActions}
          meta={meta}
          graphics={graphics}
          hasPrevious={hasPrevious}
        />
      </Modal>
      <Modal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
        title={"About " + meta.name}
      >
        <Markdown actions={actions} html={html.about} />
      </Modal>
      <Modal
        isOpen={isRulesModalOpen}
        onClose={closeRulesModal}
        title={"How to play " + meta.name}
      >
        <Markdown actions={actions} html={html.rules} />
      </Modal>
    </Fragment>
  );
};
