import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Camera, X, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const BACKEND_URL = 'http://localhost:5000'; // URL backend, sesuaikan saat deploy

const DetectPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadImage(files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar.');
      return;
    }
    setErrorMessage(null);
    setIsDetecting(true);
    setDetectionResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.detectionResult) {
        setDetectionResult({
          title: data.detectionResult.title,
          confidence: data.detectionResult.accuracy,
          episode: data.detectionResult.episode || '',
          character: data.detectionResult.character || '',
          alternativeGuesses: data.detectionResult.alternativeGuesses || [],
        });
      } else {
        setErrorMessage('Hasil deteksi tidak tersedia.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat mendeteksi.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setIsDetecting(false);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Detect Anime Title with AnimeLens
          </h1>
          <p className="text-lg text-gray-600">
            Upload your anime screenshot and let our AI instantly detect the anime title
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {!selectedImage ? (
            // Upload area
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full w-fit mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Your Anime Image
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag your image here or click to choose a file from your device
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-4">
                  We accept JPG, PNG, and GIF files (up to 10MB)
                </p>
                {errorMessage && (
                  <p className="text-red-600 mt-4">{errorMessage}</p>
                )}
              </div>
            </div>
          ) : (
            // Image preview and detection
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Preview your uploaded image
                </h3>
                <button
                  onClick={resetDetection}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image preview */}
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Uploaded anime screenshot"
                    className="w-full h-64 md:h-80 object-cover rounded-lg border"
                  />
                  {!detectionResult && !isDetecting && (
                    <button
                      onClick={() => uploadImage(fileInputRef.current?.files?.[0]!)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Click to identify the anime</span>
                    </button>
                  )}
                </div>

                {/* Detection results */}
                <div className="space-y-4">
                  {isDetecting && (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Analyzing Image...
                      </h4>
                      <p className="text-gray-600">
                        Our AI is identifying the anime
                      </p>
                    </div>
                  )}

                  {detectionResult && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">
                          Detection Complete!
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-green-700">Anime Title:</span>
                            <p className="text-xl font-bold text-green-900">{detectionResult.title}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-700">Confidence:</span>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-green-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${detectionResult.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-green-800 font-medium">
                                {Math.round(detectionResult.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          {detectionResult.episode && (
                            <div>
                              <span className="text-sm font-medium text-green-700">Episode:</span>
                              <p className="text-green-900">{detectionResult.episode}</p>
                            </div>
                          )}
                          {detectionResult.character && (
                            <div>
                              <span className="text-sm font-medium text-green-700">Character:</span>
                              <p className="text-green-900">{detectionResult.character}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 flex space-x-3">
                          <Link
                            to={`/result?anime=${encodeURIComponent(detectionResult.title)}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={resetDetection}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                          >
                            Detect Another
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DetectPage;
