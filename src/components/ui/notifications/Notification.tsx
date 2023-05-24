import useClassName from "../../../hooks/useClassName";
import { MyComponent } from "../../../types/component-types";
import { Color } from "../../../types/types";

interface INotification extends MyComponent {
    color?: Color
}

const Notification: React.FC<INotification> = props=> {
    const className = useClassName([
        "notification",
        props.color && `color-${ props.color }`,
        props.className
    ]);
    
    return (
        <div
            className={ className }
            style={ props.style }
        >
            { props.children }
        </div>
    );
};

export default Notification;