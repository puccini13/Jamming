import React, {Component} from 'react';
import './Track.css'

class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }
  render() {
    return (
      <div className="Track">
         <div className="Track-information">
           <h3>{this.props.track.name}</h3>
           <p>{this.props.track.artist} | {this.props.track.album}</p>
         </div>
       {this.renderAction()}
      </div>
    );
  }

addTrack() {
   this.props.onAdd(this.props.track);
}

removeTrack() {
  this.props.onRemove(this.props.track);
}
 renderAction() {
   /*Display minus anchor tag if the isRemoval property is true, plus is it is false */
   if (this.props.isRemoval === false) {
     return (
       <a className="Track-action" onClick={this.addTrack}>+</a>
     )
   }
   else {
     return (
       <a className="Track-action" onClick={this.removeTrack}>-</a>
     )
   }
 }

}

export default Track;
