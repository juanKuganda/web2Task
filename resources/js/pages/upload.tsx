import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import supabase, { supabaseUrl } from '@/service/bucket';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Check, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload',
        href: '/upload',
    },
];

export default function Dashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [data, setData] = useState();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        alt: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        const maxSize = 5 * 1024 * 1024; // 2MB dalam byte
        if (selectedFile!.size > maxSize) {
            setError('File size is too large. Max 5MB allowed.');
        } else {
            setFile(selectedFile!);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile!);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        try {
            let { data: users } = await supabase.from('users').select('id').single();


            // Pastikan userId memiliki nilai yang benar
            const userId = await users?.id || 'anonymous';

            const fileName = `${Date.now()}_${file.name}`;

            // 2. Upload file ke Supabase Storage
            const { data, error } = await supabase.storage
                .from('gallery') // Sesuaikan dengan nama bucket di Supabase
                .upload(`${userId}/${fileName}`, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) throw error;

            // 3. Generate URL dari gambar yang diunggah
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/gallery/${userId.toString()}/${fileName}`;

            // 4. Kirim metadata ke Laravel via Inertia
            const formDataToSend = {
                image: file,
                title: formData.title,
                description: formData.description,
                alt: formData.alt,
                image_url: imageUrl, // Simpan URL gambar di database Laravel
            };
   
  

            router.post('/upload', formDataToSend, {
                onSuccess: () => {
                  
                    setUploading(false);
                    setUploadSuccess(true);
                    setTimeout(() => {
                        setUploadSuccess(false);
                        resetForm();
                    }, 3000);
                },
                onError: (errors) => {
                    setUploading(false);
                    console.error('Upload failed:', errors);
                },
            });
                     toast.success('Image uploaded successfully!', {
                         description: 'Your image has been uploaded successfully.',
                         duration: 3000,
                     });
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        setFormData({
            title: '',
            description: '',
            alt: '',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-4xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Upload Image</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card className="col-span-1">
                                <CardContent className="pt-6">
                                    <div className="relative flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                                        {!preview ? (
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <Upload className="mb-2 h-10 w-10 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">Drag and drop your image here or click to browse</p>
                                                <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF (Max 5MB)</p>
                                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative h-full w-full">
                                                <img src={preview || '/placeholder.svg'} alt="Preview" className="h-full w-full object-contain" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                    onClick={resetForm}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {file && (
                                        <div className="mt-4 text-sm text-gray-500">
                                            <p className="truncate">
                                                <span className="font-medium">File:</span> {file.name}
                                            </p>
                                            <p>
                                                <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="col-span-1">
                                <CardContent className="space-y-4 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter image title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alt">Alt Text</Label>
                                        <Input
                                            id="alt"
                                            name="alt"
                                            placeholder="Describe the image for accessibility"
                                            value={formData.alt}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            style={{ resize: 'none' }}
                                            placeholder="Enter a detailed description of the image"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="button" variant="outline" className="mr-2" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit" className="min-w-[120px]">
                                {uploading ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : uploadSuccess ? (
                                    <span className="flex items-center">
                                        <Check className="mr-2 h-4 w-4" />
                                        Uploaded!
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
