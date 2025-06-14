import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentProofUploadModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (orderId: string, fileUrl: string) => void;
}

const PaymentProofUploadModal: React.FC<PaymentProofUploadModalProps> = ({
  orderId,
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Basic file type validation
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast.error('Please upload an image (PNG, JPG, JPEG, GIF) or a PDF file.');
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate file upload to a backend
      // In a real application, you would send `selectedFile` to your server
      // using a library like Axios and get a URL in return.
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay

      const simulatedFileUrl = URL.createObjectURL(selectedFile); // Create a temporary URL for demonstration

      toast.success('Payment proof uploaded successfully!');
      onUploadSuccess(orderId, simulatedFileUrl);
      onClose();
    } catch (error) {
      toast.error('Failed to upload payment proof.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Upload Payment Proof for Order {orderId}
        </h2>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
             onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex flex-col items-center">
              {selectedFile.type.startsWith('image/') ? (
                <ImageIcon className="w-12 h-12 text-blue-500 mb-2" />
              ) : (
                <FileText className="w-12 h-12 text-blue-500 mb-2" />
              )}
              <p className="text-gray-700 dark:text-gray-300 font-medium break-all text-sm">{selectedFile.name}</p>
              <p className="text-gray-500 text-xs">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300">Drag & drop a file here, or click to select</p>
              <p className="text-sm text-gray-500">Images (PNG, JPG, GIF) or PDF</p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Proof'
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentProofUploadModal; 