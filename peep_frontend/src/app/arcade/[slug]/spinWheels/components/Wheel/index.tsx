"use client";

import React from "react";

import "./wheel.css";
// import { ReactComponent as Arrow } from "./arrow.svg";
// import { ReactComponent as Ellipse } from "./ellipse.svg";
// import Arrow from "./arrow.svg";
// import Ellipse from "./ellipse.svg";
// import { setResults } from "services/spinResults";
// import {
//   customStyle,
//   isTouchScreendevice,
//   getFormattedResult,
//   getPositionFromCenter,
//   getWheelVars,
// } from "utils/helper";
import { arrowStyles, leftEllipseStyles, rightEllipseStyles } from "./styles";
import {
  customStyle,
  getFormattedResult,
  getPositionFromCenter,
  getWheelVars,
  isTouchScreendevice,
} from "../../../../../utils/wheels";
import { ArrowIcon, EllipseIcon } from "./icons";
interface WheelProps {
  items: string[];
  onSelectItem?: (selectedItem: number) => void;
}

interface WheelState {
  selectedItem: any;
  isActive: boolean;
  angle: number;
  startAngle: number;
  currentAngle: number;
  boxCenterPoint: any;
}

export default class Wheel extends React.Component<WheelProps, WheelState> {
  box: any;
  state: WheelState;
  constructor(props: WheelProps) {
    super(props);
    this.state = {
      selectedItem: null,
      isActive: false,
      angle: 0,
      startAngle: 0,
      currentAngle: 0,
      boxCenterPoint: {},
    };
    this.selectItem = this.selectItem.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  componentDidMount() {
    const boxPosition = this.box.getBoundingClientRect();
    const boxCenterX = boxPosition.left + boxPosition.width / 2;
    const boxCenterY = boxPosition.top + boxPosition.height / 2;

    this.setState({
      boxCenterPoint: { x: boxCenterX, y: boxCenterY },
    });

    window.onmouseup = this.mouseUpHandler;
    window.onmousemove = this.mouseMoveHandler;

    if (isTouchScreendevice()) window.ontouchend = this.mouseUpHandler;
    window.ontouchmove = this.mouseMoveHandler;
  }

  mouseDownHandler(event) {
    event.stopPropagation();
    const { boxCenterPoint } = this.state;
    const fromBoxCenter = getPositionFromCenter(event, boxCenterPoint);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    this.setState({
      startAngle: newStartAngle,
      isActive: true,
    });
  }

  mouseUpHandler(event) {
    this.deselectAll();
    event.stopPropagation();
    const { isActive, angle, startAngle, currentAngle } = this.state;
    if (isActive) {
      const newCurrentAngle = currentAngle + (angle - startAngle);
      this.setState({
        isActive: false,
        currentAngle: newCurrentAngle,
      });
    }
  }

  mouseMoveHandler(event) {
    const { isActive, currentAngle, startAngle, boxCenterPoint } = this.state;
    if (isActive) {
      const fromBoxCenter = getPositionFromCenter(event, boxCenterPoint);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);

      this.box.style.transform =
        "rotate(" +
        (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
        "deg)";
      this.setState({ angle: newAngle });
    }
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      // set result to google sheets
      const data = getFormattedResult(selectedItem);
      //   setResults(data);

      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  deselectAll() {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }

  renderWheelItems = () => {
    const { items } = this.props;
    return items.map((item, index) => (
      <div className="wheel-item" key={index} style={customStyle(index)}>
        <span className="wheel-item-text">{item}</span>
        <EllipseIcon style={rightEllipseStyles} />
        <EllipseIcon style={leftEllipseStyles} />
      </div>
    ));
  };

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;
    const wheelVars = getWheelVars(items.length, selectedItem);
    const spinning = selectedItem !== null ? "spinning" : "";

    return (
      <section className="relative flex flex-col justify-center">
        <ArrowIcon style={arrowStyles} />
        <div
          className="wheel-container"
          onMouseDown={this.mouseDownHandler}
          onMouseUp={this.mouseUpHandler}
          onTouchStart={this.mouseDownHandler}
          onTouchEnd={this.mouseUpHandler}
          ref={(div) => (this.box = div)}
        >
          <div
            className={`wheel ${spinning}`}
            style={wheelVars}
            onClick={this.selectItem}
          >
            {this.renderWheelItems()}
          </div>
        </div>
      </section>
    );
  }
}
