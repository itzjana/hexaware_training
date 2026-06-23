package com.capestone.util;

import com.capestone.exception.FileInvalidExtensionException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.List;

@Component
public class FileUtil {

    public void validateFile(MultipartFile file) throws FileNotFoundException {
        if(file.isEmpty())
            throw new FileNotFoundException("Please select file to upload");

        List<String> allowedExts = List.of("png", "jpeg", "jpg", "pdf", "docx", "pages");
        // Exact the extension of uploaded file
        String filename = file.getOriginalFilename(); //pan.jpeg
        String ext = filename.split("\\.")[1];

        if(!allowedExts.contains(ext))
            throw new FileInvalidExtensionException(ext + " not allowed");

    }
}
