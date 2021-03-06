import React from 'react';
import { ISize } from "../../../../interfaces/ISize";
import './LabelInputField.scss';
import classNames from "classnames";
import { ImageButton } from "../../../Common/ImageButton/ImageButton";
import { IRect } from "../../../../interfaces/IRect";
import { IPoint } from "../../../../interfaces/IPoint";
import { RectUtil } from "../../../../utils/RectUtil";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import { updateActiveLabelId, updateHighlightedLabelId } from "../../../../store/labels/actionCreators";
import Scrollbars from 'react-custom-scrollbars';
import { EventType } from "../../../../data/enums/EventType";
import { LabelName } from "../../../../store/labels/types";
import { LabelsSelector } from "../../../../store/selectors/LabelsSelector";
import { PopupWindowType } from "../../../../data/enums/PopupWindowType";
import { updateActivePopupType } from "../../../../store/general/actionCreators";
import TextInput from '../../../Common/TextInput/TextInput';
import { LabelPreDefine } from '../../../../settings/LabelPreDefine';

interface IProps {
    size: ISize;
    isActive: boolean;
    isHighlighted: boolean;
    id: string;  // 具体某一个label矩形框的ID
    labelValue: string,  // 文字内容
    labelRectPoint: IRect, //坐标点
    value: LabelName;  // 标签的名字
    options: LabelName[];  // 可选的标签列表

    onDelete: (id: string) => any;
    onUpdateLabelValue: (labelRectId: string, labelValue: string) => any; // 更新文字内容
    onSelectLabel: (labelRectId: string, labelNameId: string, labelName: string) => any;  // 更新标签
    updateHighlightedLabelId: (highlightedLabelId: string) => any;
    updateActiveLabelId: (highlightedLabelId: string) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;

}

interface IState {
    animate: boolean;
    isOpen: boolean;
}

class LabelInputField extends React.Component<IProps, IState> {
    private dropdownOptionHeight: number = 30;
    private dropdownOptionCount: number = 15;
    private dropdownMargin: number = 4;
    private dropdownLabel: HTMLDivElement;
    private dropdown: HTMLDivElement;

    public constructor(props) {
        super(props);
        this.state = {
            animate: false,
            isOpen: false
        }
    }
    getRectDisplayText = () => {
        const text = "x="
            + Math.ceil(this.props.labelRectPoint.x)
            + " y=" + Math.ceil(this.props.labelRectPoint.y)
            + " width=" + Math.ceil(this.props.labelRectPoint.width)
            + " height=" + Math.ceil(this.props.labelRectPoint.height);
        return text;

    }
    onChangeLabelValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("onChangeLabelValue");
        const labelValue = event.target.value;
        const labelRectId = this.props.id;

        this.props.onUpdateLabelValue(labelRectId, labelValue)
    };

    public componentDidMount(): void {
        requestAnimationFrame(() => {
            this.setState({ animate: true });
        });
    }

    private getClassName() {
        return classNames(
            "LabelInputField",
            {
                "loaded": this.state.animate,
                "active": this.props.isActive,
                "highlighted": this.props.isHighlighted
            }
        );
    }

    private openDropdown = () => {
        if (LabelsSelector.getLabelNames().length === 0) {
            this.props.updateActivePopupType(PopupWindowType.UPDATE_LABEL_NAMES);
        } else {
            this.setState({ isOpen: true });
            window.addEventListener(EventType.MOUSE_DOWN, this.closeDropdown);
        }
    };

    private closeDropdown = (event: MouseEvent) => {
        const mousePosition: IPoint = { x: event.clientX, y: event.clientY };
        const clientRect = this.dropdown.getBoundingClientRect();
        const dropDownRect: IRect = {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
        };

        if (!RectUtil.isPointInside(dropDownRect, mousePosition)) {
            this.setState({ isOpen: false });
            window.removeEventListener(EventType.MOUSE_DOWN, this.closeDropdown)
        }
    };


    private getDropdownStyle = (): React.CSSProperties => {
        const clientRect = this.dropdownLabel.getBoundingClientRect();
        const height: number = Math.min(this.props.options.length, this.dropdownOptionCount) * this.dropdownOptionHeight;
        const style = {
            width: clientRect.width * 1.5,
            height: height,
            left: clientRect.left
        };

        if (window.innerHeight * 2 / 3 < clientRect.top)
            return Object.assign(style, { top: clientRect.top - this.dropdownMargin - height });
        else
            return Object.assign(style, { top: clientRect.bottom + this.dropdownMargin });
    };

    private getDropdownOptions = () => {
        const onClick = (id: string, name: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            this.setState({ isOpen: false });
            window.removeEventListener(EventType.MOUSE_DOWN, this.closeDropdown);
            this.props.onSelectLabel(this.props.id, id, name);
            this.props.updateHighlightedLabelId(null);
            this.props.updateActiveLabelId(this.props.id);
            event.stopPropagation();
        };

        return this.props.options.map((option: LabelName) => {
            return <div
                className="DropdownOption"
                key={option.id}
                style={{ height: this.dropdownOptionHeight }}
                onClick={(event) => onClick(option.id, option.name, event)}
            >
                {option.name}
            </div>
        })
    };


    private mouseEnterHandler = () => {
        this.props.updateHighlightedLabelId(this.props.id);
    };

    private mouseLeaveHandler = () => {
        this.props.updateHighlightedLabelId(null);
    };

    private onClickHandler = () => {
        this.props.updateActiveLabelId(this.props.id);
    };

    public render() {
        const { size, id, value, onDelete } = this.props;
        return (
            <div
                className={this.getClassName()}
                style={{
                    width: size.width,
                    height: size.height,
                }}
                key={id}
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                onClick={this.onClickHandler}
            >
                <div
                    className={this.props.labelValue ? "LabelInputFieldWrapper" : "LabelInputFieldWrapper EmptyValue"}
                    style={{
                        width: size.width,
                        height: 35,
                    }}
                >
                    <div className="Marker" />
                    <div className="Content">
                        <div className="ContentWrapper">
                            <div className="DropdownLabel"
                                ref={ref => this.dropdownLabel = ref}
                                onClick={this.openDropdown}
                            >
                                {value ? value.name : "-选择标签-"}
                            </div>
                            {this.state.isOpen && <div
                                className="Dropdown"
                                style={this.getDropdownStyle()}
                                ref={ref => this.dropdown = ref}
                            >
                                <Scrollbars
                                    renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
                                >
                                    <div>
                                        {this.getDropdownOptions()}
                                    </div>
                                </Scrollbars>

                            </div>}
                        </div>

                        <div className="LabelValueEditor" key={"labelValue" + id}>
                            <TextInput
                                inputKey={"labelValue" + id}
                                value={this.props.labelValue}
                                isPassword={false}
                                label={""}
                                inputStyle={{ paddingTop: 13 }}
                                onChange={this.onChangeLabelValue}
                            />

                        </div>
                        <div className="ContentWrapper">
                            <ImageButton
                                externalClassName={"trash"}
                                image={"ico/trash.png"}
                                imageAlt={"remove_rect"}
                                buttonSize={{ width: 30, height: 30 }}
                                onClick={() => onDelete(id)}
                            />
                        </div>


                    </div>
                </div>
                <div className="RectDisplayText">
                    {this.getRectDisplayText()}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateHighlightedLabelId,
    updateActiveLabelId,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelInputField);