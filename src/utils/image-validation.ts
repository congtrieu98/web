export interface ImageValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates an image file based on various criteria
 * @param file - The image file to validate
 * @param options - Validation options
 * @returns Promise<ImageValidationResult>
 */
export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
  const {
    maxSizeInMB = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 100,
    maxWidth = 4000,
    minHeight = 100,
    maxHeight = 4000,
  } = options;

  const errors: string[] = [];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
    );
  }

  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) {
    errors.push(
      `Kích thước file quá lớn. Tối đa ${maxSizeInMB}MB, hiện tại: ${fileSizeInMB.toFixed(2)}MB`
    );
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width < minWidth) {
      errors.push(`Chiều rộng tối thiểu là ${minWidth}px, hiện tại: ${dimensions.width}px`);
    }
    
    if (dimensions.width > maxWidth) {
      errors.push(`Chiều rộng tối đa là ${maxWidth}px, hiện tại: ${dimensions.width}px`);
    }
    
    if (dimensions.height < minHeight) {
      errors.push(`Chiều cao tối thiểu là ${minHeight}px, hiện tại: ${dimensions.height}px`);
    }
    
    if (dimensions.height > maxHeight) {
      errors.push(`Chiều cao tối đa là ${maxHeight}px, hiện tại: ${dimensions.height}px`);
    }
  } catch (error) {
    errors.push('Không thể đọc thông tin hình ảnh. File có thể bị hỏng.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets image dimensions from a file
 * @param file - The image file
 * @returns Promise<{width: number, height: number}>
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Validates multiple image files
 * @param files - Array of image files to validate
 * @param options - Validation options
 * @returns Promise<ImageValidationResult[]>
 */
export async function validateImages(
  files: File[],
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult[]> {
  const validationPromises = files.map(file => validateImage(file, options));
  return Promise.all(validationPromises);
}

/**
 * Validates image URL (for remote images)
 * @param imageUrl - The image URL to validate
 * @param options - Validation options
 * @returns Promise<ImageValidationResult>
 */
export async function validateImageUrl(
  imageUrl: string,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
  const {
    minWidth = 100,
    maxWidth = 4000,
    minHeight = 100,
    maxHeight = 4000,
  } = options;

  const errors: string[] = [];

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (!response.ok) {
      errors.push('Không thể truy cập URL hình ảnh');
      return { isValid: false, errors };
    }

    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.startsWith('image/')) {
      errors.push('URL không phải là hình ảnh hợp lệ');
    }

    // Get image dimensions
    const dimensions = await getImageDimensionsFromUrl(imageUrl);
    
    if (dimensions.width < minWidth) {
      errors.push(`Chiều rộng tối thiểu là ${minWidth}px, hiện tại: ${dimensions.width}px`);
    }
    
    if (dimensions.width > maxWidth) {
      errors.push(`Chiều rộng tối đa là ${maxWidth}px, hiện tại: ${dimensions.width}px`);
    }
    
    if (dimensions.height < minHeight) {
      errors.push(`Chiều cao tối thiểu là ${minHeight}px, hiện tại: ${dimensions.height}px`);
    }
    
    if (dimensions.height > maxHeight) {
      errors.push(`Chiều cao tối đa là ${maxHeight}px, hiện tại: ${dimensions.height}px`);
    }

  } catch (error) {
    errors.push('Lỗi khi kiểm tra URL hình ảnh');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets image dimensions from URL
 * @param imageUrl - The image URL
 * @returns Promise<{width: number, height: number}>
 */
function getImageDimensionsFromUrl(imageUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image from URL'));
    };

    img.src = imageUrl;
  });
}

// Predefined validation presets
export const imageValidationPresets = {
  // For product images
  product: {
    maxSizeInMB: 10,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
    minWidth: 300,
    maxWidth: 2000,
    minHeight: 300,
    maxHeight: 2000,
  },
  
  // For avatar/profile images
  avatar: {
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'] as string[],
    minWidth: 100,
    maxWidth: 1000,
    minHeight: 100,
    maxHeight: 1000,
  },
  
  // For blog post thumbnails
  thumbnail: {
    maxSizeInMB: 3,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
    minWidth: 200,
    maxWidth: 1200,
    minHeight: 200,
    maxHeight: 1200,
  },
  
  // For general uploads
  general: {
    maxSizeInMB: 5,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
    minWidth: 100,
    maxWidth: 4000,
    minHeight: 100,
    maxHeight: 4000,
  },
};

