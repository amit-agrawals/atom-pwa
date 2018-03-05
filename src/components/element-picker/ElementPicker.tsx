import autobind from "autobind-decorator";
import classNames = require("classnames");
import * as React from "react";
import {
  AutoSizer,
  List,
  ListRowProps,
  WindowScroller
} from "react-virtualized";
import { IElement } from "../../Element";
import ElementManager from "../../ElementManager";
import { i18n } from "../../Locale";
import Button from "../shared/button/Button";
import IconButton from "../shared/icon-button/IconButton";
import Icon from "../shared/icon/Icon";
import "./ElementPicker.scss";

interface IElementPickerProps {
  onElement: (element: IElement) => void;
}

interface IElementPickerState {
  elements: IElement[];
}

@autobind
class ElementPicker extends React.Component<
  IElementPickerProps,
  IElementPickerState
> {
  public state: IElementPickerState = {
    elements: []
  };

  private listComponent: List;
  private elementListDiv: HTMLDivElement;

  public componentDidMount() {
    this.searchElements();
  }

  public render() {
    const { elements } = this.state;

    return (
      <div className="element-picker">
        <div className="element-picker__search-bar">
          <Icon name="search" />

          <input
            className="element-picker__search-bar__input"
            type="text"
            placeholder={i18n("search_elements")}
            onChange={this.onSearchInputChange}
            autoFocus={true}
          />
        </div>

        <div
          ref={ref => (this.elementListDiv = ref)}
          className="element-picker__element-list"
        >
          <WindowScroller scrollElement={this.elementListDiv}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight={true}>
                {({ width }) => (
                  <List
                    ref={list => (this.listComponent = list)}
                    autoHeight={true}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    overscanRowCount={2}
                    rowCount={elements.length}
                    rowHeight={64}
                    rowRenderer={this.elementListRowRenderer}
                    width={width}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </div>
    );
  }

  private buildElementClickListener(element: IElement) {
    return () => this.onElementClick(element);
  }

  private onElementClick(element: IElement) {
    this.props.onElement(element);
  }

  private elementListRowRenderer(props: ListRowProps) {
    const { index, key, style } = props;
    const { elements } = this.state;
    const element = elements[index];

    return (
      <div key={key} style={style}>
        <Button
          onClick={this.buildElementClickListener(element)}
          className="element-picker__element"
        >
          <div
            className={classNames(
              "element-picker__element__symbol",
              "element",
              element.group
            )}
          >
            {element.symbol}
          </div>

          <div className="element-picker__element__desc">
            <span className="element-picker__element__name">
              {/* TODO: LOCALIZE ELEMENT NAME */}
              {element.name}
            </span>

            <span className="element-picker__element__group">
              {i18n(`group_${element.group}`)}
            </span>
          </div>
        </Button>
      </div>
    );
  }

  private onSearchInputChange(event: React.FormEvent<HTMLInputElement>) {
    const value = event.currentTarget.value.toLowerCase();

    this.searchElements(value);
  }

  private searchElements(searchValue?: string) {
    const elements = ElementManager.getElements();

    if (!searchValue) {
      return this.setElements(elements);
    }

    const newElements = elements.filter(element => {
      const symbol = element.symbol.toLowerCase();
      const name = element.name.toLowerCase();

      if (symbol === searchValue) {
        return true;
      }

      if (name.includes(searchValue)) {
        return true;
      }

      return false;
    });

    this.setElements(newElements);
  }

  private setElements(elements: IElement[]) {
    this.setState({
      elements
    });

    this.listComponent.forceUpdateGrid();
  }
}

export default ElementPicker;
