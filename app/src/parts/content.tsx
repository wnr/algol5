import * as React from 'react';

import {Content} from '../../../types';

type ContentProps = {
  content: Content,
  performCommand?: (cmnd:string) => void
};

let Content = ({content, performCommand}: ContentProps)=> {
  if (typeof content === 'string'){
    return <span>{content}</span>;
  }
  switch(content.type){
    case "page":
    return <div>{content.content.map((c,i)=><Content content={c} performCommand={performCommand} key={i}/>)}</div>;
    case "line":
      return <p className="line">{content.content.map((c,i)=><Content content={c} performCommand={performCommand} key={i}/>)}</p>;
    case "text":
      return <span className={(content.text[0]||'').match(/[\,\.\!\?\:\;]/) ? "noleftmargin" : ""}>{content.text}</span>;
    case "end":
      return <span>{content.name}</span>;
    case "posref":
      return <span className="posref">{content.pos}</span>;
    case "cmndref":
      return <button onClick={()=>performCommand(content.cmnd)}>{content.alias || content.cmnd}</button>;
    case "playerref":
      return <span className="playerref">{content.player}</span>;
    case "nothing":
      return null;
    case "unittyperef":
      return <span className="unittyperef">{content.alias || content.name}</span>;
    case "goalref":
      return <span className="goalref">{content.name}</span>;
    case "conceptref":
      return <span className="conceptref">{content.name}</span>;
    case "tileref":
      return <span className="tileref">{content.name}</span>;
    default:
      console.log("Oh no :(", content);
      throw "Unknown content: " + content;
  }
};

export default Content
