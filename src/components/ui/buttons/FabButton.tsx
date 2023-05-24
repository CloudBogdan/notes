import Button, { IButton } from "./Button";

export interface IFabButton extends IButton {
    
}

const FabButton: React.FC<IFabButton> = props=> {
    return (
        <Button { ...props } compact />
    );
};

export default FabButton;