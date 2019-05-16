import React, { Component } from "react";
import { AlgolGameAPI, AlgolBattleUI } from "../../../types";

import { Board } from "../Board";
import { BattleUI } from "../BattleUI";

import dataURIs from "../../../graphics/dist/svgDataURIs";

type TesterProps = {
  api: AlgolGameAPI;
};

type TesterState = {
  ui: AlgolBattleUI;
};

export class Tester extends Component<TesterProps, TesterState> {
  act: ReturnType<AlgolGameAPI["newBattle"]>["performAction"];
  constructor(props: TesterProps) {
    super(props);
    const { initialUI, performAction } = this.props.api.newBattle();
    this.act = performAction;
    this.state = { ui: initialUI };
  }
  handleAct = (
    action: "mark" | "command" | "endTurn" | "undo",
    arg: string
  ) => {
    this.setState({
      ui: this.act(action, arg)
    });
  };
  render() {
    const { ui } = this.state;
    console.log(ui);
    return (
      <React.Fragment>
        <Board
          callback={pos => this.handleAct("mark", pos)}
          board={dataURIs[ui.gameId]}
          units={ui.board.units}
          marks={ui.board.marks}
          potentialMarks={ui.board.potentialMarks}
          anim={ui.board.anim}
        />
        <BattleUI callback={this.handleAct} ui={ui} />
      </React.Fragment>
    );
  }
}
