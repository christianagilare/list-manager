package com.company.listmanager.infrastructure.persistence.adapter;

import com.company.listmanager.application.port.out.FileUploadRepositoryPort;
import com.company.listmanager.domain.model.FileUpload;
import com.company.listmanager.infrastructure.persistence.jpa.entity.FileUploadEntity;
import com.company.listmanager.infrastructure.persistence.jpa.repository.FileUploadJpaRepository;
import org.springframework.stereotype.Component;

@Component
public class JpaFileUploadRepositoryAdapter implements FileUploadRepositoryPort {

    private final FileUploadJpaRepository jpaRepository;

    public JpaFileUploadRepositoryAdapter(FileUploadJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public FileUpload save(FileUpload fileUpload) {
        FileUploadEntity entity = toEntity(fileUpload);
        FileUploadEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    private FileUpload toDomain(FileUploadEntity e) {
        FileUpload d = new FileUpload();
        d.setId(e.getId());
        d.setTipoLista(e.getTipoLista());
        d.setObjectKey(e.getObjectKey());
        d.setOriginalFilename(e.getOriginalFilename());
        d.setUploadedBy(e.getUploadedBy());
        d.setUploadedAt(e.getUploadedAt());
        d.setStatus(e.getStatus());
        d.setTotalRows(e.getTotalRows());
        d.setInsertedRows(e.getInsertedRows());
        d.setRejectedRows(e.getRejectedRows());
        d.setErrorReport(e.getErrorReport());
        return d;
    }

    private FileUploadEntity toEntity(FileUpload d) {
        FileUploadEntity e = new FileUploadEntity();
        e.setId(d.getId());
        e.setTipoLista(d.getTipoLista());
        e.setObjectKey(d.getObjectKey());
        e.setOriginalFilename(d.getOriginalFilename());
        e.setUploadedBy(d.getUploadedBy());
        e.setUploadedAt(d.getUploadedAt());
        e.setStatus(d.getStatus());
        e.setTotalRows(d.getTotalRows());
        e.setInsertedRows(d.getInsertedRows());
        e.setRejectedRows(d.getRejectedRows());
        e.setErrorReport(d.getErrorReport());
        return e;
    }
}
