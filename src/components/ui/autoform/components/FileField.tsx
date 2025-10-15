import { Input } from "@/components/ui/input";
import type { AutoFormFieldProps } from "@autoform/react";
import React, { useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../../kibo-ui/dropzone";

export const FileField: React.FC<AutoFormFieldProps> = ({
    inputProps,
    error,
    id,
    field,
}) => {

    const [files, setFiles] = useState<File[] | undefined>();
    const [filePreview, setFilePreview] = useState<string | undefined>();

    const handleDrop = (files: File[]) => {

        setFiles(files);

        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === "string") {
                    setFilePreview(e.target?.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const { key, ...props } = inputProps;

    return (
        <>
            <Dropzone
                maxFiles={1}
                accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                onDrop={handleDrop}
                onError={console.error}
                src={files}
            >
                <DropzoneEmptyState />
                <DropzoneContent>
                    {filePreview && (
                        <div className="h-[102px] w-full">
                            <img
                                alt="Preview"
                                className="absolute top-0 left-0 h-full w-full object-cover"
                                src={filePreview}
                            />
                        </div>
                    )}
                </DropzoneContent>
            </Dropzone>
            <input type="file" hidden {...props} />
        </>
    );
};
