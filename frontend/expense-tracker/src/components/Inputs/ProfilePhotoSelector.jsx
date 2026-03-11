
import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash, LuImage } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    return (
        <div className='flex justify-center mb-8'>
            <input
                ref={inputRef}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
            />

            {!image ? (
                <div 
                    className={`w-24 h-24 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                        isDragging 
                            ? 'border-primary bg-primary/10 scale-105' 
                            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                    }`}
                    onClick={onChooseFile}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary/30 transition-colors">
                        <LuImage className='text-2xl text-primary' />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Add Profile Photo</span>
                    <span className="text-xs text-gray-500 mt-1">Click or drag & drop</span>
                </div>
            ) : (
                <div className='relative group'>
                    <img
                        src={previewUrl}
                        alt='profile'
                        className='w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white'
                    />
                    <button
                        type='button'
                        className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110'
                        onClick={handleRemoveImage}
                        title="Remove photo"
                    >
                        <LuTrash size={16} />
                    </button>
                    <button
                        type='button'
                        className='absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/90 hover:scale-110'
                        onClick={onChooseFile}
                        title="Change photo"
                    >
                        <LuUpload size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
