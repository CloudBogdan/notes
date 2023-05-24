import useClassName from "../../../hooks/useClassName";
import { MyComponent } from "../../../types/component-types";
import Config from "../../../utils/Config";
import Button from "../buttons/Button";

interface IImageInput extends MyComponent {
    onFileChange?: (file: File)=> void
    onFileWrongType?: (type: string)=> void
    onFileTooMuchSize?: (size: number)=> void
}

const ImageInput: React.FC<IImageInput> = props=> {
    const className = useClassName([
        "image-input",
        props.className
    ]);

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length == 0) return;

        const file = e.target.files[0];
        
        if (file.size < Config.MAX_FILE_SIZE) {
            if (Config.SUPPORT_IMAGE_TYPES.includes(file.type))
                props.onFileChange && props.onFileChange(file);
            else {
                props.onFileWrongType && props.onFileWrongType(file.type);
                
                if (Config.IS_DEV)
                    console.log(file.type, "- wrong image type!");
            }
        } else {
            props.onFileTooMuchSize && props.onFileTooMuchSize(file.size);
            
            if (Config.IS_DEV)
                console.log(file.size, "- too much size!");
        }

        e.target.value = "";
    }
    
    return (
        <label className={ className }>
            <Button
                element="div"
                color="blue"
                text="Choose image"
                icon="image"
            />

            <input
                type="file"
                multiple={ false }
                accept={ Config.SUPPORT_IMAGE_TYPES.join(",") }
                onChange={ onInputChange }
            />
        </label>
    );
};

export default ImageInput;