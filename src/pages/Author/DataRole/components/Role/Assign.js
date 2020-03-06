import React, { Component, Suspense } from "react";
import cls from "classnames";
import { Popover } from "antd";
import { ExtIcon, ListLoader } from 'suid';
import styles from "./Assign.less";

const ListAssign = React.lazy(() => import("./ListAssign"));
const TreeAssign = React.lazy(() => import("./TreeAssign"));

class Assign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    handlerPopoverHide = () => {
        this.setState({
            visible: false
        });
    };

    handlerShowChange = visible => {
        this.setState({ visible });
    };

    renderPopoverContent = () => {
        const { currentDataAuthorType, ...rest } = this.props;
        const assignProps = {
            handlerPopoverHide: this.handlerPopoverHide,
            currentDataAuthorType,
            ...rest,
        };
        if (currentDataAuthorType.beTree) {
            return (
                <Suspense fallback={<ListLoader />}>
                    <TreeAssign {...assignProps} />
                </Suspense>
            )
        } else {
            return (
                <Suspense fallback={<ListLoader />}>
                    <ListAssign {...assignProps} />
                </Suspense>
            )
        }
    };

    render() {
        const { visible } = this.state;
        return (
            <Popover
                trigger="click"
                placement="leftTop"
                visible={visible}
                key="assign-popover-box"
                destroyTooltipOnHide
                onVisibleChange={visible => this.handlerShowChange(visible)}
                overlayClassName={cls(styles["assign-popover-box"])}
                content={this.renderPopoverContent()}
            >
                <span className={cls("assign-popover-box-trigger")}>
                    <ExtIcon type="column" tooltip={{ title: '数据配置', placement: 'right' }} />
                </span>
            </Popover>
        );
    }
}

export default Assign;
