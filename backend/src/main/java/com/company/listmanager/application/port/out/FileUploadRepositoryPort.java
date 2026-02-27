package com.company.listmanager.application.port.out;

import com.company.listmanager.domain.model.FileUpload;

public interface FileUploadRepositoryPort {

    FileUpload save(FileUpload fileUpload);
}
