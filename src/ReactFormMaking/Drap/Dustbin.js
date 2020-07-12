import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';

const dustbinTarget = {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return
    }
    let item = monitor.getItem() || {};
    props.onDrop({...item, wrapKey: props.wrapKey, index: props.index})
  }
};

class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    didDrop: PropTypes.bool.isRequired,
    onDrop: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '',
    }
  }

  render() {
    let {connectDropTarget, children, isOverCurrent} = this.props;
    let backgroundColor = 'rgba(255, 255, 255, .8)';
    if (isOverCurrent) {
      backgroundColor = '#CCC'
    }

    return connectDropTarget(
      <div style={{width: "100%", height: "100%", backgroundColor}}>
        {children}
      </div>
    )
  }
}

export default DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  didDrop: monitor.didDrop(),
  isOverCurrent: monitor.isOver({shallow: true}),
}))(Dustbin);
