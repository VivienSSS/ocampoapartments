'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ImageViewerProps = {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    title?: string;
};

export const ImageViewer = ({
    isOpen,
    onClose,
    images,
    title = 'Image Gallery',
}: ImageViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden">
                <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-white">{title}</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {/* Main Image */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={images[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Navigation Controls */}
                    {images.length > 1 && (
                        <>
                            {/* Previous Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            {/* Next Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>

                            {/* Bottom Info Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">
                                        {currentIndex + 1} of {images.length}
                                    </span>

                                    {/* Thumbnail Strip */}
                                    <div className="flex gap-2 overflow-x-auto max-w-xs">
                                        {images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={cn(
                                                    'flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all',
                                                    index === currentIndex
                                                        ? 'border-white ring-2 ring-white/50'
                                                        : 'border-white/30 hover:border-white/60'
                                                )}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <span className="text-white text-sm"></span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
