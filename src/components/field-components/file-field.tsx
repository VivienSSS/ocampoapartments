import React, { useState } from 'react'
import { useFieldContext } from '../ui/form';
import { cn } from '@/lib/utils';
import { Label } from 'recharts';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '../ui/kibo-ui/dropzone';

const FileField = ({
    className,
    label,
    ...props
}: React.ComponentProps<'input'> & {
    label?: string;
}) => {

    const [files, setFiles] = useState<File[] | undefined>();
    const [filePreview, setFilePreview] = useState<string | undefined>();

    const field = useFieldContext<File>()

    const handleDrop = (files: File[]) => {
        field.setValue(files[0])

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

    return (
        <div className={cn('grid gap-2.5', className)}>
            {label && <Label >{label}</Label>}
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
        </div>
    )
}

export default FileField