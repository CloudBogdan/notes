import useClassName from "../../hooks/useClassName";
import { Color } from "../../types/types";
import Icon, { IconType } from "./Icon";

interface IColoredIcon {
    icon: IconType
    color?: Color
}

const ColoredIcon: React.FC<IColoredIcon> = props=> {
    const className = useClassName([
        "colored-text icon-wrapper",
        props.color && `color-${ props.color }`
    ]);
    
    return (
        <div className={ className }>
            <Icon icon={ props.icon } />
        </div>
    );
};

export default ColoredIcon;